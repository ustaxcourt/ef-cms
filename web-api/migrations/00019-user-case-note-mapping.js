const { isUserCaseNoteRecord, upGenerator } = require('./utilities');

const mutateRecord = async (item, documentClient, tableName) => {
  if (isUserCaseNoteRecord(item)) {
    const caseId = item.pk.split('|')[1];

    if (caseId) {
      const caseRecord = await documentClient
        .get({
          Key: {
            pk: `case|${caseId}`,
            sk: `case|${caseId}`,
          },
          TableName: tableName,
        })
        .promise();

      if (caseRecord && caseRecord.Item) {
        const { docketNumber } = caseRecord.Item;

        item.pk = `user-case-note|${docketNumber}`;

        return { ...item };
      }
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
