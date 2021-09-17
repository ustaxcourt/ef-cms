const faker = require('faker');
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
  saveCaseForLater,
  serveCaseToIrs,
} = require('../support/pages/create-paper-case');
const { goToMyDocumentQC } = require('../support/pages/document-qc');

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');

let token = null;
let testData = { createdPaperDocketNumber: '' };

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
      submitPetition();
      goToDashboard();
    });
  });
});

describe('Private practitioner', () => {
  before(async () => {
    const results = await getUserToken(
      'privatePractitioner1@example.com',
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
      completeWizardStep1();
    });

    // this is in its own step because sometimes the click fails, and if it's in its own step it will retry properly
    it('should go to wizard step 2', () => {
      goToWizardStep2();
    });

    it('should complete the form and submit the petition', () => {
      completeWizardStep2(hasIrsNotice.YES, 'Notice of Deficiency');
      goToWizardStep3();
      completeWizardStep3(
        filingTypes.PETITIONER_AND_SPOUSE,
        `${faker.name.firstName()} ${faker.name.lastName()}`,
      );
      goToWizardStep4();
      completeWizardStep4();
      goToWizardStep5();
      submitPetition();
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

  it('should be able to create a case and save for later', () => {
    goToMyDocumentQC();
    goToCreateCase();
    closeScannerSetupDialog();
    fillInCreateCaseFromPaperForm();
    goToReviewCase();
    saveCaseForLater();
  });

  it('should be able to create a case and serve to IRS', () => {
    goToMyDocumentQC();
    goToCreateCase();
    fillInCreateCaseFromPaperForm();
    goToReviewCase(testData);
    serveCaseToIrs();
    // TODO: docketNumber is undefined the first run of this test, consider moving
    // these steps into another it block?
    // goToCaseDetail(testData.createdPaperDocketNumber);
    // viewPrintableDocketRecord();
  });
});
