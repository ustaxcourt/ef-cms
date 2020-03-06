const { isCaseRecord, upGenerator } = require('./utilities');

/**
 * mutates given case entity's pk and sk to pre-pend 'case|' to the uuid
 *
 * @param {object} item entity
 * @param {object} documentClient dynamodb client
 * @param {string} tableName dynamodb table name
 * @returns {object|undefined} mutated item or nothing
 */
const mutateRecord = async (item, documentClient, tableName) => {
  if (isCaseRecord(item)) {
    const { caseId } = item;

    if (item.pk === caseId && item.sk === caseId) {
      console.log(
        `removing 'pk=${caseId}, sk=${caseId}' item and replacing with 'pk=case|${caseId}, sk=case|${caseId}'`,
      );

      // delete old record
      await documentClient
        .delete({
          Key: {
            pk: caseId,
            sk: caseId,
          },
          TableName: tableName,
        })
        .promise();

      // return mutated record
      return {
        ...item,
        pk: `case|${caseId}`,
        sk: `case|${caseId}`,
      };
    }
  }
};

module.exports = { mutateRecord, up: upGenerator(mutateRecord) };
