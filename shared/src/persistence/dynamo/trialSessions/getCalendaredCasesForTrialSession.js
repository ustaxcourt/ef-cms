const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../helpers/stripInternalKeys');

exports.getCalendaredCasesForTrialSession = async ({
  applicationContext,
  trialSessionId,
}) => {
  const trialSession = await client.get({
    Key: {
      pk: `trial-session-${trialSessionId}`,
      sk: `trial-session-${trialSessionId}`,
    },
    applicationContext,
  });

  const ids = (trialSession.caseOrder || []).map(metadata => metadata.caseId);

  const results = await client.batchGet({
    applicationContext,
    keys: ids.map(id => ({
      pk: id,
      sk: '0',
    })),
  });

  const afterMapping = ids.map(m => ({
    ...results.find(r => m === r.pk),
  }));

  return stripInternalKeys(afterMapping);
};
