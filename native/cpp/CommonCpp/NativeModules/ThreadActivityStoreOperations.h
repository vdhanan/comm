#pragma once

#include "../DatabaseManagers/entities/ThreadActivityEntry.h"
#include "DatabaseManager.h"
#include <vector>

namespace comm {
class ThreadActivityStoreOperationBase {
public:
  virtual void execute() = 0;
  virtual ~ThreadActivityStoreOperationBase(){};
};

class RemoveThreadActivityEntriesOperation
    : public ThreadActivityStoreOperationBase {
public:
  RemoveThreadActivityEntriesOperation(std::vector<std::string> ids)
      : ids{ids} {
  }

  virtual void execute() override {
    DatabaseManager::getQueryExecutor().removeThreadActivityEntries(this->ids);
  }

private:
  std::vector<std::string> ids;
};

class ReplaceThreadActivityEntryOperation
    : public ThreadActivityStoreOperationBase {
public:
  ReplaceThreadActivityEntryOperation(ThreadActivityEntry &&threadActivityEntry)
      : threadActivityEntry{std::move(threadActivityEntry)} {
  }

  virtual void execute() override {
    DatabaseManager::getQueryExecutor().replaceThreadActivityEntry(
        this->threadActivityEntry);
  }

private:
  ThreadActivityEntry threadActivityEntry;
};

class RemoveAllThreadActivityEntriesOperation
    : public ThreadActivityStoreOperationBase {
public:
  virtual void execute() override {
    DatabaseManager::getQueryExecutor().removeAllThreadActivityEntries();
  }
};

} // namespace comm
