const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../helpers/stripInternalKeys');

exports.getCalendaredCasesForTrialSession = async ({
  applicationContext,
  trialSessionId,
  userId,
}) => {
  const trialSession = await client.get({
    Key: {
      pk: `trial-session-${trialSessionId}`,
      sk: `trial-session-${trialSessionId}`,
    },
    applicationContext,
  });

  const ids = trialSession.caseOrder.map(metadata => metadata.caseId);

  const results = await client.batchGet({
    applicationContext,
    keys: ids.map(id => ({
      pk: id,
      sk: '0',
    })),
  });

  const afterMapping = ids.map(caseId => ({
    ...results.find(r => caseId === r.pk),
  }));

  const notes = await client
    .batchGet({
      applicationContext,
      keys: ids.map(caseId => ({
        pk: `case-note|${caseId}`,
        sk: userId,
      })),
    })
    .then(stripInternalKeys);

  const calendaredCasesWithNotes = afterMapping.map(calendaredCase => ({
    ...calendaredCase,
    notes: notes.find(note => note.caseId === calendaredCase.caseId),
  }));

  return stripInternalKeys(calendaredCasesWithNotes);
};
