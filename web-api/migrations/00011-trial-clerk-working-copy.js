const {
  TrialSessionWorkingCopy,
} = require('../../shared/src/business/entities/trialSessions/TrialSessionWorkingCopy');
const { isTrialSessionRecord, upGenerator } = require('./utilities');

const addWorkingCopy = async (item, documentClient, tableName) => {
  if (isTrialSessionRecord(item) && item.trialClerk && item.trialClerk.userId) {
    const queryResult = await documentClient
      .query({
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ExpressionAttributeValues: {
          ':pk': `trial-session-working-copy|${item.trialSessionId}`,
          ':sk': `${item.trialClerk.userId}`,
        },
        KeyConditionExpression: '#sk = :sk AND #pk = :pk',
        TableName: tableName,
      })
      .promise();

    if (queryResult.Items.length === 0) {
      const trialSessionWorkingCopyEntity = new TrialSessionWorkingCopy({
        trialSessionId: item.trialSessionId,
        userId: item.trialClerk.userId,
      });

      const newItem = {
        pk: `trial-session-working-copy|${trialSessionWorkingCopyEntity.trialSessionId}`,
        sk: `${trialSessionWorkingCopyEntity.userId}`,
        ...trialSessionWorkingCopyEntity.validate().toRawObject(),
      };

      console.log(
        `adding trial session working copy of trialSessionId "${newItem.trialSessionId}" for trial clerk "${item.trialClerk.userId}"`,
      );

      return newItem;
    }
  }
};

module.exports = { addWorkingCopy, up: upGenerator(addWorkingCopy) };
