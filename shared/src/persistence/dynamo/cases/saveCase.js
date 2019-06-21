const client = require('../../dynamodbClientService');

exports.saveVersionedCase = async ({
  applicationContext,
  caseToSave,
  existingVersion,
}) => {
  // used for associating a case to the latest version
  const currentVersion = existingVersion;
  const nextVersionToSave = parseInt(currentVersion || '0') + 1;

  const [, latest] = await Promise.all([
    client.put({
      Item: {
        pk: caseToSave.caseId,
        sk: '0',
        ...caseToSave,
        currentVersion: `${nextVersionToSave}`,
      },
      applicationContext,
    }),
    client.put({
      Item: {
        pk: caseToSave.caseId,
        sk: `${nextVersionToSave}`,
        ...caseToSave,
        currentVersion: `${nextVersionToSave}`,
      },
      applicationContext,
    }),
  ]);

  return latest;
};
