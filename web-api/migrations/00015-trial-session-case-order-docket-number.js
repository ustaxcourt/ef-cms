const createApplicationContext = require('../src/applicationContext');
const { isTrialSessionRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});
const {
  TrialSession,
} = require('../../shared/src/business/entities/trialSessions/TrialSession');

const mutateRecord = async (item, documentClient, tableName) => {
  if (isTrialSessionRecord(item)) {
    if (item.caseOrder && item.caseOrder.length) {
      for (const caseItem of item.caseOrder) {
        const caseRecord = await documentClient
          .get({
            Key: {
              pk: `case|${caseItem.caseId}`,
              sk: `case|${caseItem.caseId}`,
            },
            TableName: tableName,
          })
          .promise();

        if (!caseItem.docketNumber) {
          caseItem.docketNumber = caseRecord.Item.docketNumber;
        }
      }

      const trialSessionToUpdate = new TrialSession(item, {
        applicationContext,
      })
        .validate()
        .toRawObject();

      return { ...item, ...trialSessionToUpdate };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
