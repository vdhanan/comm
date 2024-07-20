locals {
  webapp_container_name = "webapp"

  webapp_run_server_config = jsonencode({
    runKeyserver = false
    runWebApp    = true
    runLanding   = false
  })

  webapp_environment_vars = merge(local.shared_environment_vars,
    {
      "COMM_NODE_ROLE"                          = "webapp",
      "COMM_JSONCONFIG_facts_run_server_config" = local.webapp_run_server_config
  })

  webapp_environment = [
    for name, value in local.webapp_environment_vars : {
      name  = name
      value = value
    }
  ]
}

resource "aws_cloudwatch_log_group" "webapp_service" {
  name              = "/ecs/webapp-task-def"
  retention_in_days = 7
}

resource "aws_ecs_task_definition" "webapp_service" {
  network_mode             = "awsvpc"
  family                   = "webapp-task-def"
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
      name      = local.webapp_container_name
      image     = local.keyserver_service_server_image
      essential = true
      portMappings = [
        {
          name          = "webapp-port"
          containerPort = 3000
          hostPort      = 3000,
          protocol      = "tcp"
        },

      ]
      environment = local.webapp_environment
      logConfiguration = {
        "logDriver" = "awslogs"
        "options" = {
          "awslogs-create-group"  = "true"
          "awslogs-group"         = aws_cloudwatch_log_group.webapp_service.name
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

  skip_destroy = false
}

resource "aws_ecs_service" "webapp_service" {
  depends_on = [null_resource.create_comm_database]

  name                               = "webapp-service"
  cluster                            = aws_ecs_cluster.keyserver_cluster.id
  task_definition                    = aws_ecs_task_definition.webapp_service.arn
  launch_type                        = "FARGATE"
  enable_execute_command             = true
  enable_ecs_managed_tags            = true
  force_new_deployment               = true
  desired_count                      = 2
  deployment_maximum_percent         = 100
  deployment_minimum_healthy_percent = 0


  network_configuration {
    subnets          = local.vpc_subnets
    security_groups  = [aws_security_group.keyserver_service.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.webapp_service.arn
    container_name   = local.webapp_container_name
    container_port   = 3000
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }
}

resource "aws_lb_target_group" "webapp_service" {
  name     = "webapp-service-ecs-tg"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = local.vpc_id

  # "awsvpc" network mode requires target type set to ip
  target_type = "ip"

  stickiness {
    type            = "lb_cookie"
    cookie_duration = 86500
    enabled         = true
  }

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 3

    protocol = "HTTP"
    path     = "/health"
    matcher  = "200-299"
  }
}

resource "aws_lb" "webapp_service" {
  load_balancer_type = "application"
  name               = "webapp-service-lb"
  security_groups    = [aws_security_group.lb_sg.id]

  internal = false
  subnets  = local.vpc_subnets
}

resource "aws_lb_listener" "webapp_service" {
  load_balancer_arn = aws_lb.webapp_service.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = data.aws_acm_certificate.webapp_service.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.webapp_service.arn
  }

  lifecycle {
    ignore_changes       = [default_action[0].forward[0].stickiness[0].duration]
    replace_triggered_by = [aws_lb_target_group.webapp_service]
  }
}

data "aws_acm_certificate" "webapp_service" {
  domain   = var.webapp_domain_name
  statuses = ["ISSUED"]
}
