const AWS = require('aws-sdk');

AWS.config = new AWS.Config();
AWS.config.accessKeyId = Cypress.env('AWS_ACCESS_KEY_ID');
AWS.config.secretAccessKey = Cypress.env('AWS_SECRET_ACCESS_KEY');
AWS.config.region = 'us-east-1';

const ENV = Cypress.env('ENV');

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: 'us-east-1',
});

const getClientId = async userPoolId => {
  const results = await cognito
    .listUserPoolClients({
      MaxResults: 60,
      UserPoolId: userPoolId,
    })
    .promise();
  const clientId = results.UserPoolClients[0].ClientId;
  return clientId;
};

const getUserPoolId = async () => {
  const results = await cognito
    .listUserPools({
      MaxResults: 50,
    })
    .promise();
  const userPoolId = results.UserPools.find(
    pool => pool.Name === `efcms-${ENV}`,
  ).Id;
  return userPoolId;
};

const getUserToken = async (username, password) => {
  const userPoolId = await getUserPoolId();
  const clientId = await getClientId(userPoolId);

  return cognito
    .adminInitiateAuth({
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        PASSWORD: password,
        USERNAME: username,
      },
      ClientId: clientId,
      UserPoolId: userPoolId,
    })
    .promise();
};

let token = null;

describe('petitionsclerk can login', () => {
  before(async () => {
    const results = await getUserToken(
      'petitionsclerk1@example.com',
      'Testing1234$',
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('views the section inbox', async () => {
    cy.visit(`/log-in?token=${token}`);
    cy.get('.button-switch-box').should('exist');
  });

  it('should verify advanced search works', () => {
    cy.visit(`/log-in?token=${token}&path=/search`);
    cy.get('#advanced-search-button').should('exist');
    cy.get('#petitioner-name').type('THISNAMESHOULDNEVEREXIST');
    cy.get('#advanced-search-button').click();
    cy.get('#no-search-results').should('exist');
  });
});
