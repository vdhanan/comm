resource "aws_dynamodb_table" "backup-service-backup" {
  name         = "backup-service-backup"
  hash_key     = "userID"
  range_key    = "backupID"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "userID"
    type = "S"
  }

  attribute {
    name = "backupID"
    type = "S"
  }

  attribute {
    name = "created"
    type = "S"
  }

  global_secondary_index {
    name               = "userID-created-index"
    hash_key           = "userID"
    range_key          = "created"
    projection_type    = "INCLUDE"
    non_key_attributes = ["userKeys"]
  }
}

resource "aws_dynamodb_table" "backup-service-log" {
  name         = "backup-service-log"
  hash_key     = "backupID"
  range_key    = "logID"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "backupID"
    type = "S"
  }

  attribute {
    name = "logID"
    type = "N"
  }
}

resource "aws_dynamodb_table" "blob-service-blobs" {
  name         = "blob-service-blobs"
  hash_key     = "blob_hash"
  range_key    = "holder"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "blob_hash"
    type = "S"
  }

  attribute {
    name = "holder"
    type = "S"
  }

  attribute {
    name = "last_modified"
    type = "N"
  }

  attribute {
    name = "unchecked"
    type = "S"
  }

  global_secondary_index {
    name            = "unchecked-index"
    hash_key        = "unchecked"
    range_key       = "last_modified"
    projection_type = "KEYS_ONLY"
  }
}

resource "aws_dynamodb_table" "tunnelbroker-undelivered-messages" {
  name         = "tunnelbroker-undelivered-messages"
  hash_key     = "deviceID"
  range_key    = "messageID"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "deviceID"
    type = "S"
  }

  attribute {
    name = "messageID"
    type = "S"
  }
}

resource "aws_dynamodb_table" "identity-users" {
  name             = "identity-users"
  hash_key         = "userID"
  billing_mode     = "PAY_PER_REQUEST"
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  attribute {
    name = "userID"
    type = "S"
  }

  attribute {
    name = "username"
    type = "S"
  }

  attribute {
    name = "walletAddress"
    type = "S"
  }

  attribute {
    name = "farcasterID"
    type = "S"
  }

  global_secondary_index {
    name            = "username-index"
    hash_key        = "username"
    projection_type = "KEYS_ONLY"
  }

  global_secondary_index {
    name            = "walletAddress-index"
    hash_key        = "walletAddress"
    projection_type = "KEYS_ONLY"
  }

  global_secondary_index {
    name               = "farcasterID-index"
    hash_key           = "farcasterID"
    projection_type    = "INCLUDE"
    non_key_attributes = ["walletAddress", "username"]
  }
}

resource "aws_dynamodb_table" "identity-devices" {
  name         = "identity-devices"
  hash_key     = "userID"
  range_key    = "itemID"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "userID"
    type = "S"
  }

  # this is either device ID or device list datetime
  attribute {
    name = "itemID"
    type = "S"
  }

  # only for sorting device lists
  attribute {
    name = "timestamp"
    type = "N"
  }

  # sparse index allowing to sort device list updates by timestamp
  local_secondary_index {
    name            = "deviceList-timestamp-index"
    range_key       = "timestamp"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "identity-tokens" {
  name         = "identity-tokens"
  hash_key     = "userID"
  range_key    = "signingPublicKey"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "userID"
    type = "S"
  }

  attribute {
    name = "signingPublicKey"
    type = "S"
  }
}

resource "aws_dynamodb_table" "identity-nonces" {
  name         = "identity-nonces"
  hash_key     = "nonce"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "nonce"
    type = "S"
  }

  ttl {
    attribute_name = "expirationTimeUnix"
    enabled        = true
  }
}

resource "aws_dynamodb_table" "identity-workflows-in-progress" {
  name         = "identity-workflows-in-progress"
  hash_key     = "id"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "S"
  }

  ttl {
    attribute_name = "expirationTimeUnix"
    enabled        = true
  }
}

resource "aws_dynamodb_table" "identity-reserved-usernames" {
  name             = "identity-reserved-usernames"
  hash_key         = "username"
  billing_mode     = "PAY_PER_REQUEST"
  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  attribute {
    name = "username"
    type = "S"
  }
}

resource "aws_dynamodb_table" "identity-one-time-keys" {
  name         = "identity-one-time-keys"
  hash_key     = "deviceID"
  range_key    = "oneTimeKey"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "deviceID"
    type = "S"
  }

  attribute {
    name = "oneTimeKey"
    type = "S"
  }
}

resource "aws_dynamodb_table" "feature-flags" {
  name         = "feature-flags"
  hash_key     = "platform"
  range_key    = "feature"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "platform"
    type = "S"
  }

  attribute {
    name = "feature"
    type = "S"
  }
}

resource "aws_dynamodb_table" "reports-service-reports" {
  name         = "reports-service-reports"
  hash_key     = "reportID"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "reportID"
    type = "S"
  }
}
