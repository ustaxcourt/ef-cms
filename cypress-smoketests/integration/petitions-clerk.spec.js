const AWS = require('aws-sdk');
const {
  fillInCreateCaseFromPaperForm,
} = require('../../cypress/support/pages/create-paper-petition');
const {
  getCreateACaseButton,
} = require('../../cypress/support/pages/document-qc');
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

  it('should be able to view the section inbox', () => {
    cy.visit(`/log-in?token=${token}`);
    cy.get('.button-switch-box').should('exist');
  });

  it('should be able to create a case and serve it to IRS', () => {
    cy.get('a[href*="document-qc/my/inbox"]').click();
    getCreateACaseButton().click();

    fillInCreateCaseFromPaperForm();

    cy.get('#submit-case').click();
  });

  it('should be able to QC a petition', () => {
    cy.get('a[href*="document-qc/my/inbox"]').click();
    cy.get('button:contains("Switch to")').click();
    cy.get('a[href*="petition-qc"]').first().click();
    cy.get('button#submit-case').click();
    cy.get('button:contains("Save for Later")').click();
    cy.get('div.usa-alert--success').should('exist');
  });

  it('should be able to add statistics ', () => {
    cy.get('a[href*="document-qc/my/inbox"]').click();
    cy.get('button:contains("Switch to")').click();
    cy.get('a[href*="petition-qc"]').first().click();
    cy.get('button#tab-irs-notice').click();

    // radio button not selected - bug?
    cy.get('#has-irs-verified-notice-yes').click();
    cy.get('#case-type').scrollIntoView().select('Deficiency');

    cy.get('input#year-0').type('2020');
    cy.get('input#deficiency-amount-0').type('1000');
    cy.get('input#total-penalties-0').type('10');

    cy.get('#case-edit-form button#submit-case').click();

    cy.get('#ustc-review-and-serve-form button#submit-case')
      .scrollIntoView()
      .click();
  });
});
