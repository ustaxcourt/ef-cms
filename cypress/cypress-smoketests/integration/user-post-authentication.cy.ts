import {
  addDocketEntryForOrderAndSaveForLater,
  addDocketEntryForOrderAndServePaper,
  addDocketEntryForUploadedPdfAndServe,
  addDocketEntryForUploadedPdfAndServePaper,
  clickSaveUploadedPdfButton,
  createOrder,
  editAndSignOrder,
  goToCaseDetail,
  reviewAndServePetition,
  serveCourtIssuedDocketEntry,
  uploadCourtIssuedDocPdf,
} from '../support/pages/case-detail';
import { fillInCreateCaseFromPaperForm } from '../../cypress-integration/support/pages/create-paper-petition';
import { getEnvironmentSpecificFunctions } from '../support/pages/environment-specific-factory';
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
    console.log('testData BEFORE  REVIEW CASE FUNCTION CALL', testData);

    goToReviewCase(testData);
    console.log('testData AFTER REVIEW CASE FUNCTION CALL', testData);

    serveCaseToIrs();
    // waitForElasticsearch();
  });

  it('should be able to serve the petition on the electronically-filed case', () => {
    console.log('testData BEFORE SERVING', testData);

    goToCaseDetail(testData.createdDocketNumber);
    reviewAndServePetition();
  });
});

// describe('Admission clerk', () => {
//   before(async () => {
//     const results = await getUserToken(
//       'admissionsclerk1@example.com',
//       DEFAULT_ACCOUNT_PASS,
//     );
//     token = results.AuthenticationResult.IdToken;
//   });

//   it('should be able to login', () => {
//     login(token);
//   });

//   // possibly create a new petitioner or generate a new user within the test (AND CLEAN UP)

//   it('should add an email to the party on the case', () => {
//     // find the said case
//     console.log('testData WITH ADMISSIONS CLERK', testData);

//     goToCaseDetail(testData.createdDocketNumber);

//     // go to edit petitioner and add an email
//     cy.get('#tab-case-information').click();
//     cy.get('#tab-parties').click();
//     cy.get('.edit-petitioner-button').click();
//     cy.get('#updatedEmail').type('tempPetitioner@example.com');
//     cy.get('#confirm-email').type('tempPetitioner@example.com');
//     cy.get('#submit-edit-petitioner-information').click();
//     cy.get('#modal-button-confirm').click();
//     cy.get('.modal-dialog', { timeout: 1000 }).should('not.exist');
//     cy.get(
//       'div.parties-card:contains("tempPetitioner@example.com (Pending)")',
//     ).should('exist');

//     // use (perform) the coginito's AdminSetUserPassword with a known temp password
//   });
// });

// describe('Petitioner', () => {
//   before(async () => {
//     const results = await getUserToken(
//       'petitioner@example.com',
//       DEFAULT_ACCOUNT_PASS, // this will be the temp password set (on 75)
//     );
//     token = results.AuthenticationResult.IdToken;
//   });

//   it('should be able to login with the temp token', () => {
//     login(token);
//   });

//   it('should answer the challenge', () => {
//     // cognito 'answer challenge' api to set the permanent password and login
//   });

//   it('verifies that a NOCE was generated on their case', () => {
//     // find the said case
//     // verify NOCE
//   });
// });
