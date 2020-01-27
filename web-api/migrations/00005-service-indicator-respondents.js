const isCaseRecord = item => !!item.caseType; // only case records have a caseType defined

const {
  constants,
} = require('../../shared/src/business/utilities/setServiceIndicatorsForCase');

const { forAllRecords } = require('./00004-service-indicator');

const up = async (documentClient, tableName) => {
  await forAllRecords(documentClient, tableName, async item => {
    if (!isCaseRecord(item)) return;

    item.respondents.forEach(respondent => {
      if (!respondent.serviceIndicator) {
        respondent.serviceIndicator = constants.SI_ELECTRONIC;
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
