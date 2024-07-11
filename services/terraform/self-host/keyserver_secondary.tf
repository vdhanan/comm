locals {
  keyserver_secondary_container_name = "keyserver-secondary"
}

resource "aws_cloudwatch_log_group" "keyserver_secondary_service" {
  name              = "/ecs/keyserver-secondary-task-def"
  retention_in_days = 7
}

resource "aws_ecs_task_definition" "keyserver_secondary_service" {
  depends_on = [aws_ecs_service.keyserver_primary_service]

  network_mode             = "awsvpc"
  family                   = "keyserver-secondary-task-def"
  requires_compatibilities = ["FARGATE"]
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  cpu                      = "2048"
  memory                   = "4096"

  ephemeral_storage {
    size_in_gib = 40
  }

  container_definitions = jsonencode([
    {
      name      = local.keyserver_secondary_container_name
      image     = local.keyserver_service_server_image
      essential = true
      portMappings = [
        {
          name          = "keyserver-port"
          containerPort = 3000
          hostPort      = 3000,
          protocol      = "tcp"
        },

      ]
      environment = [
        {
          name  = "REDIS_URL"
          value = "rediss://${aws_elasticache_serverless_cache.redis.endpoint[0].address}:6379"
        },
        {
          name  = "COMM_NODE_ROLE"
          value = "secondary"
        },
        {
          name  = "COMM_LISTEN_ADDR"
          value = "0.0.0.0"
        },
        {
          name  = "COMM_DATABASE_HOST"
          value = "${aws_db_instance.mariadb.address}"
        },
        {
          name  = "COMM_DATABASE_DATABASE"
          value = "comm"
        },
        {
          name  = "COMM_DATABASE_PORT"
          value = "3307"
        },
        {
          name  = "COMM_DATABASE_USER"
          value = "${var.mariadb_username}"
        },
        {
          name  = "COMM_DATABASE_PASSWORD"
          value = "${var.mariadb_password}"
        },
        {
          name  = "COMM_JSONCONFIG_secrets_user_credentials"
          value = jsonencode(var.keyserver_user_credentials)
        },
        {
          name = "COMM_JSONCONFIG_facts_keyserver_url"
          value = jsonencode({
            "baseDomain" : "https://${var.domain_name}",
            "basePath" : "/",
            "baseRoutePath" : "/",
            "https" : true,
            "proxy" : "aws"
          })
        },
        {
          name = "COMM_JSONCONFIG_facts_webapp_cors"
          value = jsonencode({
            "domain" : "https://web.comm.app"
          })
        },
        {
          name = "COMM_JSONCONFIG_facts_tunnelbroker",
          value = jsonencode({
            "url" : "${var.tunnelbroker_url}"
          })
        },
        {
          name = "COMM_JSONCONFIG_secrets_identity_service_config",
          value = jsonencode({
            "identitySocketAddr" : "${var.identity_socket_address}"
          })
        },
        {
          name  = "COMM_JSONCONFIG_facts_authoritative_keyserver",
          value = jsonencode(var.authoritative_keyserver_config),
        }
      ]
      logConfiguration = {
        "logDriver" = "awslogs"
        "options" = {
          "awslogs-create-group"  = "true"
          "awslogs-group"         = aws_cloudwatch_log_group.keyserver_secondary_service.name
          "awslogs-stream-prefix" = "ecs"
          "awslogs-region"        = "${var.region}"
        }
      }
      linuxParameters = {
        initProcessEnabled = true
      }
    }
  ])

  runtime_platform {
    cpu_architecture        = "ARM64"
    operating_system_family = "LINUX"
  }

  # Wait indefinitely for primary service to become healthy before deploying secondary service
  provisioner "local-exec" {
    command = <<EOT
      while true; do
      if curl --silent --output /dev/null --fail "https://${var.domain_name}/health"; then
          echo "Primary service is healthy. Proceeding with deployment of secondary service."
          exit 0
        else
          echo "Primary service is not healthy yet. Waiting 10 seconds before checking again..."
          sleep 10
        fi
      done
    EOT
  }

  skip_destroy = false
}

resource "aws_ecs_service" "keyserver_secondary_service" {
  depends_on = [aws_ecs_service.keyserver_primary_service]

  # Do not change name without replacing secondary_service_name in aws-deploy.sh
  name                    = "keyserver-secondary-service"
  cluster                 = aws_ecs_cluster.keyserver_cluster.id
  task_definition         = aws_ecs_task_definition.keyserver_secondary_service.arn
  launch_type             = "FARGATE"
  enable_execute_command  = true
  enable_ecs_managed_tags = true
  force_new_deployment    = true
  desired_count           = var.desired_secondary_nodes

  network_configuration {
    subnets          = local.vpc_subnets
    security_groups  = [aws_security_group.keyserver_service.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.keyserver_service.arn
    container_name   = local.keyserver_secondary_container_name
    container_port   = 3000
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }
}
