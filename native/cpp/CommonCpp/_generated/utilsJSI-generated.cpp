/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GenerateModuleH.js
 */

#include "utilsJSI.h"

namespace facebook {
namespace react {

static jsi::Value __hostFunction_CommUtilsModuleSchemaCxxSpecJSI_writeBufferToFile(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommUtilsModuleSchemaCxxSpecJSI *>(&turboModule)->writeBufferToFile(rt, args[0].asString(rt), args[1].asObject(rt));
}
static jsi::Value __hostFunction_CommUtilsModuleSchemaCxxSpecJSI_readBufferFromFile(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommUtilsModuleSchemaCxxSpecJSI *>(&turboModule)->readBufferFromFile(rt, args[0].asString(rt));
}
static jsi::Value __hostFunction_CommUtilsModuleSchemaCxxSpecJSI_base64EncodeBuffer(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommUtilsModuleSchemaCxxSpecJSI *>(&turboModule)->base64EncodeBuffer(rt, args[0].asObject(rt));
}
static jsi::Value __hostFunction_CommUtilsModuleSchemaCxxSpecJSI_base64DecodeBuffer(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommUtilsModuleSchemaCxxSpecJSI *>(&turboModule)->base64DecodeBuffer(rt, args[0].asString(rt));
}
static jsi::Value __hostFunction_CommUtilsModuleSchemaCxxSpecJSI_sha256(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommUtilsModuleSchemaCxxSpecJSI *>(&turboModule)->sha256(rt, args[0].asObject(rt));
}
static jsi::Value __hostFunction_CommUtilsModuleSchemaCxxSpecJSI_decodeUTF8ArrayBufferToString(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommUtilsModuleSchemaCxxSpecJSI *>(&turboModule)->decodeUTF8ArrayBufferToString(rt, args[0].asObject(rt));
}
static jsi::Value __hostFunction_CommUtilsModuleSchemaCxxSpecJSI_encodeStringToUTF8ArrayBuffer(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommUtilsModuleSchemaCxxSpecJSI *>(&turboModule)->encodeStringToUTF8ArrayBuffer(rt, args[0].asString(rt));
}

CommUtilsModuleSchemaCxxSpecJSI::CommUtilsModuleSchemaCxxSpecJSI(std::shared_ptr<CallInvoker> jsInvoker)
  : TurboModule("CommUtilsTurboModule", jsInvoker) {
  methodMap_["writeBufferToFile"] = MethodMetadata {2, __hostFunction_CommUtilsModuleSchemaCxxSpecJSI_writeBufferToFile};
  methodMap_["readBufferFromFile"] = MethodMetadata {1, __hostFunction_CommUtilsModuleSchemaCxxSpecJSI_readBufferFromFile};
  methodMap_["base64EncodeBuffer"] = MethodMetadata {1, __hostFunction_CommUtilsModuleSchemaCxxSpecJSI_base64EncodeBuffer};
  methodMap_["base64DecodeBuffer"] = MethodMetadata {1, __hostFunction_CommUtilsModuleSchemaCxxSpecJSI_base64DecodeBuffer};
  methodMap_["sha256"] = MethodMetadata {1, __hostFunction_CommUtilsModuleSchemaCxxSpecJSI_sha256};
  methodMap_["decodeUTF8ArrayBufferToString"] = MethodMetadata {1, __hostFunction_CommUtilsModuleSchemaCxxSpecJSI_decodeUTF8ArrayBufferToString};
  methodMap_["encodeStringToUTF8ArrayBuffer"] = MethodMetadata {1, __hostFunction_CommUtilsModuleSchemaCxxSpecJSI_encodeStringToUTF8ArrayBuffer};
}


} // namespace react
} // namespace facebook
