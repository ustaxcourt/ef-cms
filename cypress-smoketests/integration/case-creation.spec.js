const {
  closeScannerSetupDialog,
  goToCreateCase,
  goToReviewCase,
  saveCaseForLater,
  serveCaseToIrs,
} = require('../support/pages/create-paper-case');
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
} = require('../../cypress/support/pages/create-paper-petition');
const { getUserToken, login } = require('../support/pages/login');
const { goToMyDocumentQC } = require('../support/pages/document-qc');

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
    login(token);
  });

  it('should be able to create a case', () => {
    goToStartCreatePetition();
    goToWizardStep1();
    completeWizardStep1();
    goToWizardStep2();
    completeWizardStep2(hasIrsNotice.NO, 'Innocent Spouse');
    goToWizardStep3();
    completeWizardStep3(filingTypes.INDIVIDUAL, 'Petitioner');
    goToWizardStep4();
    completeWizardStep4();
    goToWizardStep5();
    submitPetition();
    goToDashboard();
  });
});

describe('Private practitioner', () => {
  before(async () => {
    const results = await getUserToken(
      'privatePractitioner1@example.com',
      'Testing1234$',
    );
    token = results.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('should be able to create a case', () => {
    goToStartCreatePetition();
    completeWizardStep1();
    goToWizardStep2();
    completeWizardStep2(hasIrsNotice.YES, 'Notice of Deficiency');
    goToWizardStep3();
    completeWizardStep3(
      filingTypes.PETITIONER_AND_SPOUSE,
      'Private practitioner',
    );
    goToWizardStep4();
    completeWizardStep4();
    goToWizardStep5();
    submitPetition();
    goToDashboard();
  });
});

describe('Petitions clerk', () => {
  before(async () => {
    const results = await getUserToken(
      'petitionsclerk1@example.com',
      'Testing1234$',
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
    goToReviewCase();
    serveCaseToIrs();
  });
});
