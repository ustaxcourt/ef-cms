const AWS = require('aws-sdk');
const { getUserToken } = require('../support/pages/login');

AWS.config = new AWS.Config();
AWS.config.accessKeyId = Cypress.env('AWS_ACCESS_KEY_ID');
AWS.config.secretAccessKey = Cypress.env('AWS_SECRET_ACCESS_KEY');
AWS.config.region = 'us-east-1';

let token = null;

describe('Petitioner', () => {
  before(async () => {
    const results = await getUserToken(
      'petitioner1@example.com',
      'Testing1234$',
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    cy.visit(`/log-in?token=${token}`);
  });

  it('should be able to create a case', () => {
    cy.get('a#file-a-petition').click();

    cy.get('a[href*="file-a-petition/step-1"]').click();

    cy.upload_file('w3-dummy.pdf', 'input#stin-file');
    cy.get('button#submit-case').click();

    cy.upload_file('w3-dummy.pdf', 'input#petition-file');
    cy.get('#irs-notice-radios').scrollIntoView();
    cy.get('#irs-notice-radios label').first().click();
    cy.get('#case-type').scrollIntoView().select('Notice of Deficiency');
    cy.get('button#submit-case').click();

    cy.get('label#filing-type-0').scrollIntoView().click();
    cy.get('input#name').scrollIntoView().type('John');
    cy.get('input[name="contactPrimary.address1"]')
      .scrollIntoView()
      .type('111 South West St.');
    cy.get('input[name="contactPrimary.city"]')
      .scrollIntoView()
      .type('Orlando');
    cy.get('select[name="contactPrimary.state"]').scrollIntoView().select('AL');
    cy.get('input[name="contactPrimary.postalCode"]')
      .scrollIntoView()
      .type('12345');
    cy.get('input#phone').scrollIntoView().type('1111111111');
    cy.get('button#submit-case').click();

    cy.get('label#procedure-type-0').scrollIntoView().click();
    cy.get('#preferred-trial-city').scrollIntoView().select('Mobile, Alabama');
    cy.get('button#submit-case').click();

    cy.get('button#submit-case').scrollIntoView().click();

    cy.get('a#button-back-to-dashboard').click();
  });

  it('should be able to file a document', () => {
    cy.get('a[href*="case-detail/"]').first().click();
  });

  it('should be able to file a document', () => {});
});
