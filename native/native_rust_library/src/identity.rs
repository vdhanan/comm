use grpc_clients::identity::get_unauthenticated_client;
use grpc_clients::identity::protos::unauth::Empty;

use crate::utils::jsi_callbacks::{
  handle_bool_result_as_callback, handle_string_result_as_callback,
};
use crate::{Error, RUNTIME};
use crate::{CODE_VERSION, DEVICE_TYPE, IDENTITY_SOCKET_ADDR};

pub mod exact_user_search;
pub mod farcaster;
pub mod wallet_registration;

pub mod ffi {
  use super::*;

  pub use exact_user_search::ffi::*;
  pub use farcaster::ffi::*;
  pub use wallet_registration::ffi::*;

  pub fn generate_nonce(promise_id: u32) {
    RUNTIME.spawn(async move {
      let result = fetch_nonce().await;
      handle_string_result_as_callback(result, promise_id);
    });
  }

  pub fn version_supported(promise_id: u32) {
    RUNTIME.spawn(async move {
      let result = version_supported_helper().await;
      handle_bool_result_as_callback(result, promise_id);
    });
  }
}

async fn fetch_nonce() -> Result<String, Error> {
  let mut identity_client = get_unauthenticated_client(
    IDENTITY_SOCKET_ADDR,
    CODE_VERSION,
    DEVICE_TYPE.as_str_name().to_lowercase(),
  )
  .await?;
  let nonce = identity_client
    .generate_nonce(Empty {})
    .await?
    .into_inner()
    .nonce;
  Ok(nonce)
}

async fn version_supported_helper() -> Result<bool, Error> {
  let mut identity_client = get_unauthenticated_client(
    IDENTITY_SOCKET_ADDR,
    CODE_VERSION,
    DEVICE_TYPE.as_str_name().to_lowercase(),
  )
  .await?;
  let response = identity_client.ping(Empty {}).await;
  match response {
    Ok(_) => Ok(true),
    Err(e) => {
      if grpc_clients::error::is_version_unsupported(&e) {
        Ok(false)
      } else {
        Err(e.into())
      }
    }
  }
}
