const client = require('../../dynamodbClientService');

exports.updateCaseDeadline = async ({
  applicationContext,
  caseDeadlineToUpdate,
}) => {
  await client.put({
    Item: {
      pk: `case-deadline-${caseDeadlineToUpdate.caseDeadlineId}`,
      sk: `case-deadline-${caseDeadlineToUpdate.caseDeadlineId}`,
      ...caseDeadlineToUpdate,
    },
    applicationContext,
  });
};
