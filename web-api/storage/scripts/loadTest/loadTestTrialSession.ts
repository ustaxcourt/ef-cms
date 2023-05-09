const AWS = require('aws-sdk');
const axios = require('axios');
const {
  addCaseToTrialSession,
  createCase,
  createTrialSession,
  getUserToken,
} = require('./loadTestHelpers');
const { createApplicationContext } = require('../../../src/applicationContext');

Error.stackTraceLimit = Infinity;

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.REGION,
});

(async () => {
  let petitionerUser;
  let docketClerkUser;

  let token = await getUserToken({
    cognito,
    env: process.env.ENV,
    password: process.env.DEFAULT_ACCOUNT_PASS,
    username: 'petitioner1@example.com',
  });

  let response = await axios.get(
    `https://api-${process.env.DEPLOYING_COLOR}.${process.env.EFCMS_DOMAIN}/users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  petitionerUser = response.data;

  token = await getUserToken({
    cognito,
    env: process.env.ENV,
    password: process.env.DEFAULT_ACCOUNT_PASS,
    username: 'docketclerk1@example.com',
  });

  response = await axios.get(
    `https://api-${process.env.DEPLOYING_COLOR}.${process.env.EFCMS_DOMAIN}/users`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  docketClerkUser = response.data;

  const trialSessionEntity = await createTrialSession({
    applicationContext: createApplicationContext(docketClerkUser),
  });
  const { trialSessionId } = trialSessionEntity;

  let petitionFileId;
  let stinFileId;

  for (let i = 0; i < +process.env.SIZE; i++) {
    console.log(
      `Adding case #${i + 1} to Trial Session ID: ${trialSessionId}.`,
    );
    try {
      const { caseDetail, ...caseResult } = await createCase({
        applicationContext: createApplicationContext(petitionerUser),
        petitionFileId,
        stinFileId,
      });
      ({ petitionFileId, stinFileId } = caseResult);

      const { docketNumber } = caseDetail;
      await addCaseToTrialSession({
        applicationContext: createApplicationContext(docketClerkUser),
        docketNumber,
        trialSessionId,
      });
    } catch (e) {
      console.log('err', e);
      throw e;
    }
  }

  console.log(`Completed adding cases to Trial Session ID: ${trialSessionId}.`);
})();
