use tokio::time::Duration;

pub const GRPC_TX_QUEUE_SIZE: usize = 32;
pub const GRPC_SERVER_PORT: u16 = 50051;
pub const GRPC_KEEP_ALIVE_PING_INTERVAL: Duration = Duration::from_secs(3);
pub const GRPC_KEEP_ALIVE_PING_TIMEOUT: Duration = Duration::from_secs(10);

pub const SOCKET_HEARTBEAT_TIMEOUT: Duration = Duration::from_secs(3);

pub const MAX_RMQ_MSG_PRIORITY: u8 = 10;
pub const DDB_RMQ_MSG_PRIORITY: u8 = 10;
pub const CLIENT_RMQ_MSG_PRIORITY: u8 = 1;
pub const RMQ_CONSUMER_TAG: &str = "tunnelbroker";

pub const LOG_LEVEL_ENV_VAR: &str =
  tracing_subscriber::filter::EnvFilter::DEFAULT_ENV;

pub mod dynamodb {
  // This table holds messages which could not be immediately delivered to
  // a device.
  //
  // - (primary key) = (deviceID: Partition Key, createdAt: Sort Key)
  // - deviceID: The public key of a device's olm identity key
  // - payload: Message to be delivered. See shared/tunnelbroker_messages.
  // - messageID = [createdAt]#[clientMessageID]
  //    - createdAd:  UNIX timestamp of when the item was inserted.
  //      Timestamp is needed to order the messages correctly to the device.
  //      Timestamp format is ISO 8601 to handle lexicographical sorting.
  //    - clientMessageID: Message ID generated on client using UUID Version 4.
  pub mod undelivered_messages {
    pub const TABLE_NAME: &str = "tunnelbroker-undelivered-messages";
    pub const PARTITION_KEY: &str = "deviceID";
    pub const DEVICE_ID: &str = "deviceID";
    pub const PAYLOAD: &str = "payload";
    pub const MESSAGE_ID: &str = "messageID";
    pub const SORT_KEY: &str = "messageID";
  }

  // This table holds a device token associated with a device.
  //
  // - (primary key) = (deviceID: Partition Key)
  // - deviceID: The public key of a device's olm identity key
  // - deviceToken: Token to push services uploaded by device.
  pub mod device_tokens {
    pub const TABLE_NAME: &str = "tunnelbroker-device-tokens";
    pub const PARTITION_KEY: &str = "deviceID";
    pub const DEVICE_ID: &str = "deviceID";
    pub const DEVICE_TOKEN: &str = "deviceToken";

    pub const DEVICE_TOKEN_INDEX_NAME: &str = "deviceToken-index";
  }
}
