import { TDynamoRecord } from '../../../../../src/persistence/dynamo/dynamoTypes';

const isJudgeUserItem = item => {
  return item.pk.startsWith('user|') && item.role === 'judge';
};

const isCaseRecord = item => {
  return item.pk.startsWith('case|') && item.sk.startsWith('case|');
};

export const migrateItems = items => {
  const judgeUserItems = items.filter(item => isJudgeUserItem(item));

  const judgesMap = judgeUserItems.reduce((accumulator, judge) => {
    accumulator[judge.name] = judge.userId;
    return accumulator;
  }, {});

  const itemsAfter: TDynamoRecord[] = [];

  for (const item of items.slice(0, 20)) {
    if (
      isCaseRecord(item) &&
      item.associatedJudge &&
      item.associatedJudge !== 'Chief Judge'
    ) {
      // TODO: do we need to throw an error if the judge name doesnt exist in the map
      item.associatedJudgeId = judgesMap[item.associatedJudge];
    }

    itemsAfter.push(item);
  }

  return itemsAfter;
};
