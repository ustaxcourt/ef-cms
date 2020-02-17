const {
  SERVICE_INDICATOR_TYPES,
} = require('../../shared/src/business/entities/cases/CaseConstants');
const { isCaseRecord } = require('./utilities');

const up = async (documentClient, tableName, forAllRecords) => {
  await forAllRecords(documentClient, tableName, async item => {
    if (!isCaseRecord(item)) return;
    if (!item.respondents) return;

    item.respondents.forEach(respondent => {
      if (!respondent.serviceIndicator) {
        respondent.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
      }
    });

    await documentClient
      .put({
        Item: item,
        TableName: tableName,
      })
      .promise();
  });
};

module.exports = {
  up,
};
