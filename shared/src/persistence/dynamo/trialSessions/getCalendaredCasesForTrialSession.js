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

  const { caseOrder } = trialSession;

  const results = await client.batchGet({
    applicationContext,
    keys: caseOrder.map(myCase => ({
      pk: myCase.caseId,
      sk: myCase.caseId,
    })),
  });

  const afterMapping = caseOrder.map(myCase => ({
    ...myCase,
    ...results.find(r => myCase.caseId === r.pk),
  }));

  let notes = [];
  if (userId) {
    notes = await client
      .batchGet({
        applicationContext,
        keys: caseOrder.map(myCase => ({
          pk: `case-note|${myCase.caseId}`,
          sk: userId,
        })),
      })
      .then(stripInternalKeys);
  }

  const calendaredCasesWithNotes = afterMapping.map(calendaredCase => ({
    ...calendaredCase,
    notes: notes.find(note => note.caseId === calendaredCase.caseId),
  }));

  return stripInternalKeys(calendaredCasesWithNotes);
};
