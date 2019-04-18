const client = require('../../dynamodbClientService');

exports.saveVersionedCase = async ({
  existingVersion,
  caseToSave,
  applicationContext,
}) => {
  // used for associating a case to the latest version
  const currentVersion = existingVersion;
  const nextVersionToSave = parseInt(currentVersion || '0') + 1;

  // update the current history
  await client.put({
    Item: {
      pk: caseToSave.caseId,
      sk: '0',
      ...caseToSave,
      currentVersion: `${nextVersionToSave}`,
    },
    applicationContext,
  });

  // add a history entry
  return await client.put({
    Item: {
      pk: caseToSave.caseId,
      sk: `${nextVersionToSave}`,
      ...caseToSave,
      currentVersion: `${nextVersionToSave}`,
    },
    applicationContext,
  });
};
