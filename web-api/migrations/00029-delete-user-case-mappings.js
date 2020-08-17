const {
  DOCKET_NUMBER_MATCHER,
} = require('../../shared/src/business/entities/EntityConstants');
const { isUserCaseMappingRecord, upGenerator } = require('./utilities');

const mutateRecord = async (item, documentClient, tableName) => {
  if (isUserCaseMappingRecord(item)) {
    const caseIdentifier = item.sk.split('|')[1];

    if (caseIdentifier && !caseIdentifier.match(DOCKET_NUMBER_MATCHER)) {
      await documentClient
        .delete({
          Key: {
            pk: item.pk,
            sk: item.sk,
          },
          TableName: tableName,
        })
        .promise();
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
