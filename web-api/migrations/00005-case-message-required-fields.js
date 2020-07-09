const createApplicationContext = require('../src/applicationContext');
const {
  CaseMessage,
} = require('../../shared/src/business/entities/CaseMessage');
const { isCaseMessageRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});

const mutateRecord = async (item, documentClient, tableName) => {
  if (isCaseMessageRecord(item)) {
    if (!item.caseStatus || !item.caseTitle) {
      const caseRecord = await documentClient
        .get({
          Key: {
            pk: `case|${item.caseId}`,
            sk: `case|${item.caseId}`,
          },
          TableName: tableName,
        })
        .promise();

      const { caseCaption, status } = caseRecord.Item;
      const caseTitle = applicationContext.getCaseTitle(caseCaption);

      const messageAfter = {
        ...item,
        caseStatus: status,
        caseTitle,
      };

      const caseMessageEntity = new CaseMessage(messageAfter, {
        applicationContext,
      })
        .validate()
        .toRawObject();

      return { ...item, ...caseMessageEntity };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
