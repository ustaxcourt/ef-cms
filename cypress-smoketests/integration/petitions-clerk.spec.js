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

  it('should be able to view the section inbox', () => {
    cy.visit(`/log-in?token=${token}`);
    cy.get('.button-switch-box').should('exist');
  });

  // Not necessary right now, this test exists as part of the deploy process already
  // it('should be able to create a case', () => {});
  // it('should be able to save newly created case for later', () => {});

  it('should be able to QC a petition', () => {
    cy.get('a[href*="document-qc/my/inbox"]').click();
    cy.get('button:contains("Switch to")').click();
    cy.get('a[href*="petition-qc"]').first().click();
    cy.get('button#submit-case').click();
    cy.get('button:contains("Save for Later")').click();
    cy.get('div.usa-alert--success').should('exist');
  });

  it('should be able to add statistics ', () => {
    cy.get('button:contains("Switch to")').click();
    cy.get('a[href*="petition-qc"]').first().click();
    cy.get('button#tab-irs-notice').click();

    // radio button not selected - bug?
    cy.get('#has-irs-verified-notice-yes').click();

    cy.get('input#date-of-notice-month').type('08');
    cy.get('input#date-of-notice-day').type('08');
    cy.get('input#date-of-notice-year').type('2020');
  });

  // it('should verify advanced search works', () => {
  //   cy.visit(`/log-in?token=${token}&path=/search`);
  //   cy.get('#advanced-search-button').should('exist');
  //   cy.get('#petitioner-name').type('THISNAMESHOULDNEVEREXIST');
  //   cy.get('#advanced-search-button').click();
  //   cy.get('#no-search-results').should('exist');
  // });
});
