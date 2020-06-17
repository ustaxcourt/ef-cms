const {
  completeWizardStep1,
  completeWizardStep2,
  completeWizardStep3,
  completeWizardStep4,
  goToDashboard,
  goToStartCreatePetition,
  goToWizardStep1,
  goToWizardStep2,
  goToWizardStep3,
  goToWizardStep4,
  goToWizardStep5,
  submitPetition,
} = require('../support/pages/create-electronic-petition');
const { getUserToken, login } = require('../support/pages/login');

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
    completeWizardStep2();
    goToWizardStep3();
    completeWizardStep3();
    goToWizardStep4();
    completeWizardStep4();
    goToWizardStep5();

    submitPetition();

    goToDashboard();
  });

  it('should be able to file a document', () => {
    cy.get('a[href*="case-detail/"]').first().click();
    // TODO - petition must be QC-d before document can be filed
  });
});
