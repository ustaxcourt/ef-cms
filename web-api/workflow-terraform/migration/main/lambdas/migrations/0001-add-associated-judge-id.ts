import { TDynamoRecord } from '../../../../../src/persistence/dynamo/dynamoTypes';

const isJudgeUserItem = item => {
  return (
    item.pk.startsWith('user|') &&
    item.sk.startsWith('user|') &&
    (item.role === 'judge' || item.role === 'legacyJudge')
  );
};

const isCaseRecord = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

const isCaseDeadline = item => {
  return (
    item.pk.startsWith('case-deadline|') && item.sk.startsWith('case-deadline|')
  );
};

const isWorkItem = item => {
  return item.gsi1pk?.startsWith('work-item|');
};

const isRecordToUpdate = item => {
  return isCaseRecord(item) || isCaseDeadline(item) || isWorkItem(item);
};

export const migrateItems = items => {
  const judgeUserItems = items.filter(item => isJudgeUserItem(item));

  const judgesMap = judgeUserItems.reduce((accumulator, judge) => {
    accumulator[judge.name] = judge.userId;
    return accumulator;
  }, {});

  const itemsAfter: TDynamoRecord[] = [];

  for (const item of items) {
    if (
      isRecordToUpdate(item) &&
      item.associatedJudge &&
      item.associatedJudge !== 'Chief Judge'
    ) {
      item.associatedJudgeId = judgesMap[item.associatedJudge];
    }

    itemsAfter.push(item);
  }

  return itemsAfter;
};
