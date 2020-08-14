const createApplicationContext = require('../src/applicationContext');
const { isUserCaseNoteRecord, upGenerator } = require('./utilities');
const applicationContext = createApplicationContext({});
const {
  UserCaseNote,
} = require('../../shared/src/business/entities/notes/UserCaseNote');

const mutateRecord = async (item, documentClient, tableName) => {
  if (isUserCaseNoteRecord(item) && !item.docketNumber) {
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
      let { docketNumber } = caseRecord.Item;

      if (docketNumber) {
        const itemToUpdate = new UserCaseNote(
          { ...item, docketNumber },
          { applicationContext },
        )
          .validate()
          .toRawObject();

        return { ...item, ...itemToUpdate };
      }
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
