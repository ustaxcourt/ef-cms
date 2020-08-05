const {
  DOCKET_NUMBER_MATCHER,
} = require('../../shared/src/business/entities/EntityConstants');
const { upGenerator } = require('./utilities');

const mutateRecord = async (item, documentClient, tableName) => {
  if (item.pk.startsWith('case|')) {
    const caseIdentifier = item.pk.split('|')[1];

    if (caseIdentifier && !caseIdentifier.match(DOCKET_NUMBER_MATCHER)) {
      console.log('deleting record for case', caseIdentifier);
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
