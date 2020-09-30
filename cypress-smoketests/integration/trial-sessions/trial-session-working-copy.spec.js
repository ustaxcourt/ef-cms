const faker = require('faker');
const {
  addCaseNote,
  changeCaseTrialStatus,
  checkShowAllFilterOnWorkingCopy,
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
  judgeName: 'Judge Cohen',
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

  describe('should be able to create the first case', () => {
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
      completeWizardStep3(filingTypes.INDIVIDUAL, 'Petitioner');
      goToWizardStep4();
      completeWizardStep4();
      goToWizardStep5();
      submitPetition(testData);
      goToDashboard();
    });
  });

  describe('should be able to create the second case', () => {
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
      completeWizardStep3(filingTypes.INDIVIDUAL, 'Petitioner');
      goToWizardStep4();
      completeWizardStep4();
      goToWizardStep5();
      submitPetition(testData);
      goToDashboard();
    });
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
    const result = await getUserToken('jcohen@example.com', 'Testing1234$');
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

  it('edits trial session working copy case trial status', () => {
    changeCaseTrialStatus(testData.docketNumbers[0]);
  });

  it('edits trial session working copy filters', () => {
    filterWorkingCopyByStatus({
      docketNumberShouldExist: testData.docketNumbers[1],
      docketNumberShouldNotExist: testData.docketNumbers[0],
      status: 'Set for Trial',
    });
  });

  it('edits trial session working copy case notes', () => {
    addCaseNote(testData.docketNumbers[1], 'Judge case note');
  });
});

describe('Judge Chambers', () => {
  before(async () => {
    const result = await getUserToken(
      'cohensChambers1@example.com',
      'Testing1234$',
    );
    token = result.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('views trial session working copy', () => {
    checkShowAllFilterOnWorkingCopy(testData.trialSessionIds[0]);
    goToTrialSessionWorkingCopy({
      ...testData,
      trialSessionId: testData.trialSessionIds[0],
    });
  });

  it('edits trial session working copy case trial status', () => {
    changeCaseTrialStatus(testData.docketNumbers[1], 'Continued');
  });

  it('edits trial session working copy filters', () => {
    filterWorkingCopyByStatus({
      docketNumberShouldExist: testData.docketNumbers[0],
      docketNumberShouldNotExist: testData.docketNumbers[1],
      status: 'Continued',
    });
  });

  it('edits trial session working copy case notes', () => {
    addCaseNote(testData.docketNumbers[0], 'Chambers case note');
  });
});
