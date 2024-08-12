/**
 * This code was generated by [react-native-codegen](https://www.npmjs.com/package/react-native-codegen).
 *
 * Do not edit this file as changes may cause incorrect behavior and will be lost
 * once the code is regenerated.
 *
 * @generated by codegen project: GenerateModuleH.js
 */

#include "commJSI.h"

namespace facebook {
namespace react {

static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getDraft(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->getDraft(rt, args[0].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_updateDraft(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->updateDraft(rt, args[0].asString(rt), args[1].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_moveDraft(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->moveDraft(rt, args[0].asString(rt), args[1].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getClientDBStore(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->getClientDBStore(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_removeAllDrafts(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->removeAllDrafts(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getAllMessagesSync(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->getAllMessagesSync(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_processMessageStoreOperationsSync(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->processMessageStoreOperationsSync(rt, args[0].asObject(rt).asArray(rt));
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getAllThreadsSync(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->getAllThreadsSync(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_processReportStoreOperationsSync(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->processReportStoreOperationsSync(rt, args[0].asObject(rt).asArray(rt));
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_processThreadStoreOperationsSync(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->processThreadStoreOperationsSync(rt, args[0].asObject(rt).asArray(rt));
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_processDBStoreOperations(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->processDBStoreOperations(rt, args[0].asObject(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_initializeCryptoAccount(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->initializeCryptoAccount(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getUserPublicKey(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->getUserPublicKey(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getOneTimeKeys(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->getOneTimeKeys(rt, args[0].asNumber());
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_validateAndGetPrekeys(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->validateAndGetPrekeys(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_validateAndUploadPrekeys(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->validateAndUploadPrekeys(rt, args[0].asString(rt), args[1].asString(rt), args[2].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_initializeNotificationsSession(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->initializeNotificationsSession(rt, args[0].asString(rt), args[1].asString(rt), args[2].asString(rt), args[3].isNull() || args[3].isUndefined() ? std::nullopt : std::make_optional(args[3].asString(rt)), args[4].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_isNotificationsSessionInitialized(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->isNotificationsSessionInitialized(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_isDeviceNotificationsSessionInitialized(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->isDeviceNotificationsSessionInitialized(rt, args[0].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_isNotificationsSessionInitializedWithDevices(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->isNotificationsSessionInitializedWithDevices(rt, args[0].asObject(rt).asArray(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_updateKeyserverDataInNotifStorage(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->updateKeyserverDataInNotifStorage(rt, args[0].asObject(rt).asArray(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_removeKeyserverDataFromNotifStorage(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->removeKeyserverDataFromNotifStorage(rt, args[0].asObject(rt).asArray(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getKeyserverDataFromNotifStorage(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->getKeyserverDataFromNotifStorage(rt, args[0].asObject(rt).asArray(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_initializeContentOutboundSession(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->initializeContentOutboundSession(rt, args[0].asString(rt), args[1].asString(rt), args[2].asString(rt), args[3].isNull() || args[3].isUndefined() ? std::nullopt : std::make_optional(args[3].asString(rt)), args[4].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_initializeContentInboundSession(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->initializeContentInboundSession(rt, args[0].asString(rt), args[1].asObject(rt), args[2].asString(rt), args[3].asNumber(), args[4].asBool());
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_isContentSessionInitialized(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->isContentSessionInitialized(rt, args[0].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_initializeNotificationsOutboundSession(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->initializeNotificationsOutboundSession(rt, args[0].asString(rt), args[1].asString(rt), args[2].asString(rt), args[3].isNull() || args[3].isUndefined() ? std::nullopt : std::make_optional(args[3].asString(rt)), args[4].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_encrypt(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->encrypt(rt, args[0].asString(rt), args[1].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_encryptNotification(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->encryptNotification(rt, args[0].asString(rt), args[1].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_encryptAndPersist(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->encryptAndPersist(rt, args[0].asString(rt), args[1].asString(rt), args[2].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_decrypt(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->decrypt(rt, args[0].asObject(rt), args[1].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_decryptAndPersist(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->decryptAndPersist(rt, args[0].asObject(rt), args[1].asString(rt), args[2].asString(rt), args[3].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_signMessage(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->signMessage(rt, args[0].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_verifySignature(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->verifySignature(rt, args[0].asString(rt), args[1].asString(rt), args[2].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getCodeVersion(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->getCodeVersion(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_terminate(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->terminate(rt);
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_setNotifyToken(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->setNotifyToken(rt, args[0].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_clearNotifyToken(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->clearNotifyToken(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_stampSQLiteDBUserID(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->stampSQLiteDBUserID(rt, args[0].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getSQLiteStampedUserID(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->getSQLiteStampedUserID(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_clearSensitiveData(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->clearSensitiveData(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_checkIfDatabaseNeedsDeletion(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->checkIfDatabaseNeedsDeletion(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_reportDBOperationsFailure(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->reportDBOperationsFailure(rt);
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_computeBackupKey(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->computeBackupKey(rt, args[0].asString(rt), args[1].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_generateRandomString(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->generateRandomString(rt, args[0].asNumber());
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_setCommServicesAuthMetadata(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->setCommServicesAuthMetadata(rt, args[0].asString(rt), args[1].asString(rt), args[2].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getCommServicesAuthMetadata(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->getCommServicesAuthMetadata(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_clearCommServicesAuthMetadata(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->clearCommServicesAuthMetadata(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_setCommServicesAccessToken(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->setCommServicesAccessToken(rt, args[0].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_clearCommServicesAccessToken(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->clearCommServicesAccessToken(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_startBackupHandler(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->startBackupHandler(rt);
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_stopBackupHandler(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->stopBackupHandler(rt);
  return jsi::Value::undefined();
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_createNewBackup(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->createNewBackup(rt, args[0].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_createNewSIWEBackup(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->createNewSIWEBackup(rt, args[0].asString(rt), args[1].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_restoreBackup(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->restoreBackup(rt, args[0].asString(rt), args[1].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_restoreSIWEBackup(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->restoreSIWEBackup(rt, args[0].asString(rt), args[1].asString(rt), args[2].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_restoreBackupData(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->restoreBackupData(rt, args[0].asString(rt), args[1].asString(rt), args[2].asString(rt), args[3].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_retrieveBackupKeys(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->retrieveBackupKeys(rt, args[0].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_retrieveLatestSIWEBackupData(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->retrieveLatestSIWEBackupData(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_setSIWEBackupSecrets(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->setSIWEBackupSecrets(rt, args[0].asObject(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getSIWEBackupSecrets(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->getSIWEBackupSecrets(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getAllInboundP2PMessages(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->getAllInboundP2PMessages(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_removeInboundP2PMessages(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->removeInboundP2PMessages(rt, args[0].asObject(rt).asArray(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getOutboundP2PMessagesByID(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->getOutboundP2PMessagesByID(rt, args[0].asObject(rt).asArray(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getAllOutboundP2PMessages(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->getAllOutboundP2PMessages(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_markOutboundP2PMessageAsSent(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->markOutboundP2PMessageAsSent(rt, args[0].asString(rt), args[1].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_removeOutboundP2PMessagesOlderThan(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->removeOutboundP2PMessagesOlderThan(rt, args[0].asString(rt), args[1].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_resetOutboundP2PMessagesForDevice(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->resetOutboundP2PMessagesForDevice(rt, args[0].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getSyncedDatabaseVersion(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->getSyncedDatabaseVersion(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_markPrekeysAsPublished(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->markPrekeysAsPublished(rt);
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getRelatedMessages(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->getRelatedMessages(rt, args[0].asString(rt));
}
static jsi::Value __hostFunction_CommCoreModuleSchemaCxxSpecJSI_searchMessages(jsi::Runtime &rt, TurboModule &turboModule, const jsi::Value* args, size_t count) {
  return static_cast<CommCoreModuleSchemaCxxSpecJSI *>(&turboModule)->searchMessages(rt, args[0].asString(rt), args[1].asString(rt), args[2].isNull() || args[2].isUndefined() ? std::nullopt : std::make_optional(args[2].asString(rt)), args[3].isNull() || args[3].isUndefined() ? std::nullopt : std::make_optional(args[3].asString(rt)));
}

CommCoreModuleSchemaCxxSpecJSI::CommCoreModuleSchemaCxxSpecJSI(std::shared_ptr<CallInvoker> jsInvoker)
  : TurboModule("CommTurboModule", jsInvoker) {
  methodMap_["getDraft"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getDraft};
  methodMap_["updateDraft"] = MethodMetadata {2, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_updateDraft};
  methodMap_["moveDraft"] = MethodMetadata {2, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_moveDraft};
  methodMap_["getClientDBStore"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getClientDBStore};
  methodMap_["removeAllDrafts"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_removeAllDrafts};
  methodMap_["getAllMessagesSync"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getAllMessagesSync};
  methodMap_["processMessageStoreOperationsSync"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_processMessageStoreOperationsSync};
  methodMap_["getAllThreadsSync"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getAllThreadsSync};
  methodMap_["processReportStoreOperationsSync"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_processReportStoreOperationsSync};
  methodMap_["processThreadStoreOperationsSync"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_processThreadStoreOperationsSync};
  methodMap_["processDBStoreOperations"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_processDBStoreOperations};
  methodMap_["initializeCryptoAccount"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_initializeCryptoAccount};
  methodMap_["getUserPublicKey"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getUserPublicKey};
  methodMap_["getOneTimeKeys"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getOneTimeKeys};
  methodMap_["validateAndGetPrekeys"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_validateAndGetPrekeys};
  methodMap_["validateAndUploadPrekeys"] = MethodMetadata {3, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_validateAndUploadPrekeys};
  methodMap_["initializeNotificationsSession"] = MethodMetadata {5, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_initializeNotificationsSession};
  methodMap_["isNotificationsSessionInitialized"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_isNotificationsSessionInitialized};
  methodMap_["isDeviceNotificationsSessionInitialized"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_isDeviceNotificationsSessionInitialized};
  methodMap_["isNotificationsSessionInitializedWithDevices"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_isNotificationsSessionInitializedWithDevices};
  methodMap_["updateKeyserverDataInNotifStorage"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_updateKeyserverDataInNotifStorage};
  methodMap_["removeKeyserverDataFromNotifStorage"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_removeKeyserverDataFromNotifStorage};
  methodMap_["getKeyserverDataFromNotifStorage"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getKeyserverDataFromNotifStorage};
  methodMap_["initializeContentOutboundSession"] = MethodMetadata {5, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_initializeContentOutboundSession};
  methodMap_["initializeContentInboundSession"] = MethodMetadata {5, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_initializeContentInboundSession};
  methodMap_["isContentSessionInitialized"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_isContentSessionInitialized};
  methodMap_["initializeNotificationsOutboundSession"] = MethodMetadata {5, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_initializeNotificationsOutboundSession};
  methodMap_["encrypt"] = MethodMetadata {2, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_encrypt};
  methodMap_["encryptNotification"] = MethodMetadata {2, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_encryptNotification};
  methodMap_["encryptAndPersist"] = MethodMetadata {3, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_encryptAndPersist};
  methodMap_["decrypt"] = MethodMetadata {2, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_decrypt};
  methodMap_["decryptAndPersist"] = MethodMetadata {4, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_decryptAndPersist};
  methodMap_["signMessage"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_signMessage};
  methodMap_["verifySignature"] = MethodMetadata {3, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_verifySignature};
  methodMap_["getCodeVersion"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getCodeVersion};
  methodMap_["terminate"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_terminate};
  methodMap_["setNotifyToken"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_setNotifyToken};
  methodMap_["clearNotifyToken"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_clearNotifyToken};
  methodMap_["stampSQLiteDBUserID"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_stampSQLiteDBUserID};
  methodMap_["getSQLiteStampedUserID"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getSQLiteStampedUserID};
  methodMap_["clearSensitiveData"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_clearSensitiveData};
  methodMap_["checkIfDatabaseNeedsDeletion"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_checkIfDatabaseNeedsDeletion};
  methodMap_["reportDBOperationsFailure"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_reportDBOperationsFailure};
  methodMap_["computeBackupKey"] = MethodMetadata {2, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_computeBackupKey};
  methodMap_["generateRandomString"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_generateRandomString};
  methodMap_["setCommServicesAuthMetadata"] = MethodMetadata {3, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_setCommServicesAuthMetadata};
  methodMap_["getCommServicesAuthMetadata"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getCommServicesAuthMetadata};
  methodMap_["clearCommServicesAuthMetadata"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_clearCommServicesAuthMetadata};
  methodMap_["setCommServicesAccessToken"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_setCommServicesAccessToken};
  methodMap_["clearCommServicesAccessToken"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_clearCommServicesAccessToken};
  methodMap_["startBackupHandler"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_startBackupHandler};
  methodMap_["stopBackupHandler"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_stopBackupHandler};
  methodMap_["createNewBackup"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_createNewBackup};
  methodMap_["createNewSIWEBackup"] = MethodMetadata {2, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_createNewSIWEBackup};
  methodMap_["restoreBackup"] = MethodMetadata {2, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_restoreBackup};
  methodMap_["restoreSIWEBackup"] = MethodMetadata {3, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_restoreSIWEBackup};
  methodMap_["restoreBackupData"] = MethodMetadata {4, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_restoreBackupData};
  methodMap_["retrieveBackupKeys"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_retrieveBackupKeys};
  methodMap_["retrieveLatestSIWEBackupData"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_retrieveLatestSIWEBackupData};
  methodMap_["setSIWEBackupSecrets"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_setSIWEBackupSecrets};
  methodMap_["getSIWEBackupSecrets"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getSIWEBackupSecrets};
  methodMap_["getAllInboundP2PMessages"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getAllInboundP2PMessages};
  methodMap_["removeInboundP2PMessages"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_removeInboundP2PMessages};
  methodMap_["getOutboundP2PMessagesByID"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getOutboundP2PMessagesByID};
  methodMap_["getAllOutboundP2PMessages"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getAllOutboundP2PMessages};
  methodMap_["markOutboundP2PMessageAsSent"] = MethodMetadata {2, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_markOutboundP2PMessageAsSent};
  methodMap_["removeOutboundP2PMessagesOlderThan"] = MethodMetadata {2, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_removeOutboundP2PMessagesOlderThan};
  methodMap_["resetOutboundP2PMessagesForDevice"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_resetOutboundP2PMessagesForDevice};
  methodMap_["getSyncedDatabaseVersion"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getSyncedDatabaseVersion};
  methodMap_["markPrekeysAsPublished"] = MethodMetadata {0, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_markPrekeysAsPublished};
  methodMap_["getRelatedMessages"] = MethodMetadata {1, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_getRelatedMessages};
  methodMap_["searchMessages"] = MethodMetadata {4, __hostFunction_CommCoreModuleSchemaCxxSpecJSI_searchMessages};
}


} // namespace react
} // namespace facebook
