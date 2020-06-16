const AWS = require('aws-sdk');
const { getUserToken } = require('../support/pages/login');

AWS.config = new AWS.Config();
AWS.config.accessKeyId = Cypress.env('AWS_ACCESS_KEY_ID');
AWS.config.secretAccessKey = Cypress.env('AWS_SECRET_ACCESS_KEY');
AWS.config.region = 'us-east-1';

let token = null;

describe('Petitions clerk', () => {
  before(async () => {
    const results = await getUserToken(
      'petitionsclerk1@example.com',
      'Testing1234$',
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('views the section inbox', () => {
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
