const faker = require('faker');
const {
  addCaseNote,
  changeCaseTrialStatus,
  checkShowAllFilterOnWorkingCopy,
  createTrialSession,
  filterWorkingCopyByStatus,
  goToTrialSession,
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
  confirmUser,
  getRestApi,
  getUserToken,
  login,
} = require('../../support/pages/login');
const {
  goToCaseOverview,
  manuallyAddCaseToNewTrialSession,
} = require('../../support/pages/case-detail');

faker.seed(faker.random.number());

let token = null;
let adminToken = null;

const testData = {
  docketNumbers: [],
  judgeName: 'Cohen',
  preferredTrialCity: 'Boise, Idaho',
  trialClerk: 'Test trialclerk3',
  trialSessionIds: [],
};

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');

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

// eslint-disable-next-line no-unused-vars
let judgeUserId;
describe('Petitions Clerk', () => {
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

describe.skip('Judge', () => {
  before(async () => {
    const results = await getUserToken(
      'judge.smoke@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = results.AuthenticationResult.IdToken;
  });

  after(async () => {
    // await disableUser({ userId: judgeUserId });
  });

  it('should be able to login', () => {
    login(token);
  });

  it('views trial session working copy', () => {
    checkShowAllFilterOnWorkingCopy(testData.trialSessionIds[0]);
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

// Skipping this test until #4830 is done
// This test is currently failing as the story involves importing current and legacy judges.
// Currently, multiple entries with the same judge name are avilable in the judge dropdown and therefore
// the 'correct' judge user is not being associated with the newly created trial session.
describe.skip('Judge Chambers', () => {
  before(async () => {
    const chambersToCreate = {
      email: 'smokeysChambers1@example.com',
      name: 'Smokey Chambers',
      password: DEFAULT_ACCOUNT_PASS,
      role: 'chambers',
      section: 'smokeysChambers',
    };

    const restApi = await getRestApi();

    cy.request({
      body: chambersToCreate,
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      url: `${restApi}/users`,
    });

    await confirmUser({ email: 'smokeysChambers1@example.com' });

    const result = await getUserToken(
      'smokeysChambers1@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    token = result.AuthenticationResult.IdToken;
  });

  it('should be able to login', () => {
    login(token);
  });

  it('views trial session working copy', () => {
    checkShowAllFilterOnWorkingCopy(testData.trialSessionIds[0]);
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
