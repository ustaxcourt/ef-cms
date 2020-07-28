const { isEligibleForTrialRecord, upGenerator } = require('./utilities');

const mutateRecord = async (item, documentClient, tableName) => {
  if (isEligibleForTrialRecord(item)) {
    const caseId = item.gsi1pk.split('|')[1];

    if (caseId) {
      const caseRecord = await documentClient
        .get({
          Key: {
            pk: `case|${item.caseId}`,
            sk: `case|${item.caseId}`,
          },
          TableName: tableName,
        })
        .promise();

      if (caseRecord && caseRecord.Item) {
        const { docketNumber } = caseRecord.Item;

        item.gsi1pk = `eligible-for-trial-case-catalog|${docketNumber}`;
        item.docketNumber = docketNumber;
        item.sk = item.sk.replace(caseId, docketNumber);

        return { ...item };
      }
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
