import { AuthenticationResult } from '../../support/login-types';
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
import {
  completeWizardStep1,
  completeWizardStep2,
  completeWizardStep3,
  completeWizardStep4,
  filingTypes,
  goToDashboard,
  goToStartCreatePetition,
  goToWizardStep1,
  goToWizardStep2,
  goToWizardStep3,
  goToWizardStep4,
  goToWizardStep5,
  hasIrsNotice,
  submitPetition,
} from '../support/pages/create-electronic-petition';
import { faker } from '@faker-js/faker';
import { fillInCreateCaseFromPaperForm } from '../../cypress-integration/support/pages/create-paper-petition';
import { getEnvironmentSpecificFunctions } from '../support/pages/environment-specific-factory';
import {
  goToCreateCase,
  goToReviewCase,
  serveCaseToIrs,
} from '../support/pages/create-paper-case';
import { goToMyDocumentQC } from '../support/pages/document-qc';

let token: string;
const testData = {};

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');

const { closeScannerSetupDialogIfExists, login } =
  getEnvironmentSpecificFunctions();

describe('Files some cases', { scrollBehavior: 'center' }, () => {
  it('creates a case and does a bunch of stuff', () => {
    cy.task<AuthenticationResult>('getUserToken', {
      email: 'petitioner1@example.com',
      password: Cypress.env('DEFAULT_ACCOUNT_PASS'),
    }).then(result => {
      token = result.AuthenticationResult.IdToken;
      login(token);
    });
    goToStartCreatePetition();
    goToWizardStep1();
    completeWizardStep1();
    goToWizardStep2();
    completeWizardStep2(hasIrsNotice.NO, 'Innocent Spouse');
    goToWizardStep3();
    completeWizardStep3(
      filingTypes.INDIVIDUAL,
      `${faker.person.firstName()} ${faker.person.lastName()}`,
    );
    goToWizardStep4();
    completeWizardStep4();
    goToWizardStep5();
    submitPetition(testData);
    goToDashboard();

    cy.task<AuthenticationResult>('getUserToken', {
      email: 'petitionsclerk1@example.com',
      password: DEFAULT_ACCOUNT_PASS,
    }).then(result => {
      token = result.AuthenticationResult.IdToken;
      login(token);
    });
    goToMyDocumentQC();
    goToCreateCase();
    closeScannerSetupDialogIfExists();
    fillInCreateCaseFromPaperForm();
    goToReviewCase().then(createdPaperDocketNumber => {
      serveCaseToIrs();
      goToCaseDetail(testData.createdDocketNumber);
      reviewAndServePetition();

      cy.task<AuthenticationResult>('getUserToken', {
        email: 'docketclerk1@example.com',
        password: DEFAULT_ACCOUNT_PASS,
      }).then(result => {
        token = result.AuthenticationResult.IdToken;
        login(token);
      });
      // eslint-disable-next-line no-underscore-dangle
      const attempt = cy.state('runnable')._currentRetry;
      createOrder(testData.createdDocketNumber);
      editAndSignOrder();
      addDocketEntryForOrderAndSaveForLater(attempt);
      serveCourtIssuedDocketEntry();
      createOrder(createdPaperDocketNumber);
      editAndSignOrder();
      addDocketEntryForOrderAndServePaper();
      goToCaseDetail(testData.createdDocketNumber);
      uploadCourtIssuedDocPdf();
      clickSaveUploadedPdfButton();
      addDocketEntryForUploadedPdfAndServe();
      goToCaseDetail(createdPaperDocketNumber);
      uploadCourtIssuedDocPdf();
      clickSaveUploadedPdfButton();
      addDocketEntryForUploadedPdfAndServePaper();
    });
  });
});
