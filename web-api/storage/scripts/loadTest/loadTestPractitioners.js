const AWS = require('aws-sdk');
const axios = require('axios');
const createApplicationContext = require('../../../src/applicationContext');
const { createCase, getUserToken } = require('./loadTestHelpers');

Error.stackTraceLimit = Infinity;

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.REGION,
});

(async () => {
  let practitionerUser;

  const apigateway = new AWS.APIGateway({
    region: process.env.REGION,
  });
  const { items: apis } = await apigateway
    .getRestApis({ limit: 200 })
    .promise();

  const services = apis
    .filter(api => api.name.includes(`gateway_api_${process.env.ENV}`))
    .reduce((obj, api) => {
      obj[
        api.name.replace(`_${process.env.ENV}`, '')
      ] = `https://${api.id}.execute-api.${process.env.REGION}.amazonaws.com/${process.env.ENV}`;
      return obj;
    }, {});

  const token = await getUserToken({
    cognito,
    env: process.env.ENV,
    password: 'Testing1234$',
    username: 'practitioner1@example.com',
  });

  const response = await axios.get(`${services['gateway_api']}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  practitionerUser = response.data;

  let petitionFileId;
  let stinFileId;

  for (let i = 0; i < +process.env.SIZE; i++) {
    console.log(`Adding case #${i + 1}`);
    try {
      const { ...caseResult } = await createCase({
        applicationContext: createApplicationContext(practitionerUser),
        petitionFileId,
        stinFileId,
      });
      ({ petitionFileId, stinFileId } = caseResult);
    } catch (e) {
      console.log('err', e);
    }
  }

  console.log('Completed adding cases');
})();
