import { confirmUser } from '../support/pages/login';
import { faker } from '@faker-js/faker';
import { fillInCreateCaseFromPaperForm } from '../../cypress-integration/support/pages/create-paper-petition';
import { getEnvironmentSpecificFunctions } from '../support/pages/environment-specific-factory';
import { goToCaseDetail } from '../support/pages/case-detail';
import {
  goToCreateCase,
  goToReviewCase,
  serveCaseToIrs,
} from '../support/pages/create-paper-case';
import { goToMyDocumentQC } from '../support/pages/document-qc';
const { closeScannerSetupDialog, getUserToken, login } =
  getEnvironmentSpecificFunctions();

let token = null;
const testData = {};

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');
const randomizedEmail = `${faker.string.uuid()}@example.com`;

describe('Petitions clerk', () => {
  before(async () => {
    const results = await getUserToken(
      'petitionsclerk1@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should be able to create a case with paper service', () => {
    goToMyDocumentQC();
    goToCreateCase();
    closeScannerSetupDialog();
    fillInCreateCaseFromPaperForm();
    goToReviewCase(testData);
    serveCaseToIrs();
  });
});

describe('Admission clerk', () => {
  before(async () => {
    const results = await getUserToken(
      'admissionsclerk@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  // possibly create a new petitioner or generate a new user within the test (AND CLEAN UP)

  it('should add an email to the party on the case', () => {
    goToCaseDetail(testData.createdPaperDocketNumber);

    // go to edit petitioner and add an email
    cy.get('#tab-case-information').click();
    cy.get('#tab-parties').click();
    cy.get('.edit-petitioner-button').click();
    cy.get('#updatedEmail').type(randomizedEmail);
    cy.get('#confirm-email').type(randomizedEmail);
    cy.get('#submit-edit-petitioner-information').click();
    cy.get('#modal-button-confirm').click();
    cy.get('.modal-dialog', { timeout: 1000 }).should('not.exist');
    cy.get(`div.parties-card:contains(${randomizedEmail} (Pending))`).should(
      'exist',
    );
  });
});

describe('Petitioner', () => {
  it('should confirm user', async () => {
    await confirmUser({ email: randomizedEmail });
  });
  it('should be able to login with new password', async () => {
    const results = await getUserToken(randomizedEmail, DEFAULT_ACCOUNT_PASS);
    token = results.AuthenticationResult.IdToken;
    login(token);
  });
  it('verifies that a NOCE was generated on their case', () => {
    // find the said case
    console.log('testData', testData);
    goToCaseDetail(testData.createdPaperDocketNumber);
    cy.get('tbody:contains(NOCE)').should('exist');
    cy.get('#tab-case-information').click();
    cy.get('#tab-parties').click();
    cy.get('div.parties-card:contains((Pending))').should('not.exist');
    // verify NOCE
  });
});

// TODO: WRITE A DEVEX TASK TO CLEAN UP MOCK USERS CREATED FROM SMOKETESTS
