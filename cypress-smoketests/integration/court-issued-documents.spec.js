const faker = require('faker');
const {
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
} = require('../support/pages/case-detail');
const {
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
} = require('../support/pages/create-electronic-petition');
const {
  fillInCreateCaseFromPaperForm,
} = require('../../cypress-integration/support/pages/create-paper-petition');
const {
  getEnvironmentSpecificFunctions,
} = require('../support/pages/environment-specific-factory');
const {
  goToCreateCase,
  goToReviewCase,
  serveCaseToIrs,
} = require('../support/pages/create-paper-case');
const { goToMyDocumentQC } = require('../support/pages/document-qc');

let token = null;
const testData = {};

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');

const { closeScannerSetupDialog, getUserToken, login } =
  getEnvironmentSpecificFunctions();

describe('Petitioner', () => {
  before(async () => {
    const results = await getUserToken(
      'petitioner1@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  describe('should be able to create a case', () => {
    it('should complete wizard step 1', () => {
      goToStartCreatePetition();
      goToWizardStep1();
      completeWizardStep1();
    });

    // this is in its own step because sometimes the click fails, and if it's in its own step it will retry properly
    it('should go to wizard step 2', () => {
      goToWizardStep2();
    });

    it('should complete the form and submit the petition', () => {
      completeWizardStep2(hasIrsNotice.NO, 'Innocent Spouse');
      goToWizardStep3();
      completeWizardStep3(
        filingTypes.INDIVIDUAL,
        `${faker.name.firstName()} ${faker.name.lastName()}`,
      );
      goToWizardStep4();
      completeWizardStep4();
      goToWizardStep5();
      submitPetition(testData);
      goToDashboard();
    });
  });
});

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

  it('should be able to serve the petition on the electronically-filed case', () => {
    goToCaseDetail(testData.createdDocketNumber);
    reviewAndServePetition();
  });
});

describe('Docket Clerk', () => {
  before(async () => {
    const results = await getUserToken(
      'docketclerk1@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should be able to create an order on the electronically-filed case and serve it', () => {
    createOrder(testData.createdDocketNumber);
    editAndSignOrder();
    addDocketEntryForOrderAndSaveForLater();
    serveCourtIssuedDocketEntry();
  });

  it('should be able to create an order on the paper-filed case and serve it', () => {
    createOrder(testData.createdPaperDocketNumber);
    editAndSignOrder();
    addDocketEntryForOrderAndServePaper();
  });

  it('should be able to upload a court-issued order pdf on the electronically-filed case', () => {
    goToCaseDetail(testData.createdDocketNumber);
    uploadCourtIssuedDocPdf();
  });

  // in its own step for retry purposes - sometimes the click fails
  it('should click the save uploaded PDF button', () => {
    clickSaveUploadedPdfButton();
  });

  it('should add a docket entry for the uploaded PDF and serve', () => {
    addDocketEntryForUploadedPdfAndServe();
  });

  it('should be able to upload a court-issued order pdf on the paper-filed case', () => {
    goToCaseDetail(testData.createdPaperDocketNumber);

    uploadCourtIssuedDocPdf();
  });

  // in its own step for retry purposes - sometimes the click fails
  it('should click the save uploaded PDF button', () => {
    clickSaveUploadedPdfButton();
  });

  it('should add a docket entry for the uploaded PDF and serve for paper', () => {
    addDocketEntryForUploadedPdfAndServePaper();
  });
});
