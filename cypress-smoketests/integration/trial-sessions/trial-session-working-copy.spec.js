const faker = require('faker');
const {
  addCaseNote,
  changeCaseTrialStatus,
  createTrialSession,
  filterWorkingCopyByStatus,
  goToTrialSession,
  goToTrialSessionWorkingCopy,
  markCaseAsQcCompleteForTrial,
  setTrialSessionAsCalendared,
} = require('../../support/pages/trial-sessions');
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
} = require('../../support/pages/create-electronic-petition');
const {
  goToCaseOverview,
  manuallyAddCaseToNewTrialSession,
} = require('../../support/pages/case-detail');
const { getUserToken, login } = require('../../support/pages/login');

faker.seed(faker.random.number());

let token = null;
const testData = {
  docketNumbers: [],
  judgeName: 'Judge Wells',
  preferredTrialCity: 'Boise, Idaho',
  trialClerk: 'Test trialclerk3',
  trialSessionIds: [],
};

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

  it('should be able to create the first case', () => {
    goToStartCreatePetition();
    goToWizardStep1();
    completeWizardStep1();
  });

  it('should be able to create the first case', () => {
    goToWizardStep2();
    completeWizardStep2(hasIrsNotice.NO, 'Innocent Spouse');
    goToWizardStep3();
    completeWizardStep3(filingTypes.INDIVIDUAL, 'Petitioner');
    goToWizardStep4();
    completeWizardStep4();
    goToWizardStep5();
    submitPetition(testData);
    goToDashboard();
  });

  it('should be able to create the second case', () => {
    goToStartCreatePetition();
    goToWizardStep1();
    completeWizardStep1();
  });

  it('should be able to create the second case', () => {
    goToWizardStep2();
    completeWizardStep2(hasIrsNotice.NO, 'Innocent Spouse');
    goToWizardStep3();
    completeWizardStep3(filingTypes.INDIVIDUAL, 'Petitioner');
    goToWizardStep4();
    completeWizardStep4();
    goToWizardStep5();
    submitPetition(testData);
    goToDashboard();
  });
});

describe('Petitions Clerk', () => {
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

  describe('should create and set a trial session', () => {
    beforeEach(() => {
      cy.server();
      cy.route({ method: 'POST', url: '/trial-sessions' }).as(
        'postTrialSession',
      );
    });

    it('creates a trial session', () => {
      createTrialSession(testData);
    });

    it('manually adds first case to trial session', () => {
      goToCaseOverview(testData.docketNumbers[0]);
      manuallyAddCaseToNewTrialSession(testData.trialSessionIds[0]);
    });

    it('manually adds second case to trial session', () => {
      goToCaseOverview(testData.docketNumbers[1]);
      manuallyAddCaseToNewTrialSession(testData.trialSessionIds[0]);
    });

    it('sets the trial session as calendared', () => {
      goToTrialSession(testData.trialSessionIds[0]);
      markCaseAsQcCompleteForTrial(testData.docketNumbers[0]);
      markCaseAsQcCompleteForTrial(testData.docketNumbers[1]);
      setTrialSessionAsCalendared(testData.trialSessionIds[0]);
    });
  });
});

describe('Judge', () => {
  before(async () => {
    const result = await getUserToken('jwells@example.com', 'Testing1234$');
    token = result.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('views trial session working copy', () => {
    goToTrialSessionWorkingCopy({
      ...testData,
      trialSessionId: testData.trialSessionIds[0],
    });
  });

  it('edits trial session working copy case trial status, filters, and notes', () => {
    changeCaseTrialStatus(testData.docketNumbers[0]);
  });

  it('edits trial session working copy case trial status, filters, and notes', () => {
    filterWorkingCopyByStatus({
      docketNumberShouldExist: testData.docketNumbers[1],
      docketNumberShouldNotExist: testData.docketNumbers[0],
    });
  });

  it('edits trial session working copy case trial status, filters, and notes', () => {
    addCaseNote(testData.docketNumbers[0]);
  });
});
