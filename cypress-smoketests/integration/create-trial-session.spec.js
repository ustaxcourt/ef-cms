const faker = require('faker');
const {
  blockCaseFromTrial,
  goToCaseOverview,
  manuallyAddCaseToCalendaredTrialSession,
  manuallyAddCaseToNewTrialSession,
  removeCaseFromTrialSession,
  setCaseAsHighPriority,
  setCaseAsReadyForTrial,
  unblockCaseFromTrial,
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
  createTrialSession,
  goToTrialSession,
  markCaseAsQcCompleteForTrial,
  setTrialSessionAsCalendared,
  verifyOpenCaseOnTrialSession,
} = require('../support/pages/trial-sessions');
const {
  getEnvironmentSpecificFunctions,
} = require('../support/pages/environment-specific-factory');
const {
  runTrialSessionPlanningReport,
  viewBlockedCaseOnBlockedReport,
} = require('../support/pages/reports');

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');

faker.seed(faker.datatype.number());

let docketClerkToken = null;
let petitionsClerkToken = null;
const testData = {
  preferredTrialCity: 'Mobile, Alabama',
  trialSessionIds: [],
};

let firstDocketNumber;
let secondDocketNumber;
const caseTestData = { docketNumbers: [] };

describe('Petitions Clerk', () => {
  const { getUserToken, login } = getEnvironmentSpecificFunctions();

  before(async () => {
    let result = await getUserToken(
      'petitionsclerk1@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    petitionsClerkToken = result.AuthenticationResult.IdToken;
    result = await getUserToken(
      'docketclerk1@example.com',
      DEFAULT_ACCOUNT_PASS,
    );
    docketClerkToken = result.AuthenticationResult.IdToken;
  });

  describe('Petitioner creates cases', () => {
    let petitionerToken;

    describe('Petitioner', () => {
      before(async () => {
        const results = await getUserToken(
          'petitioner1@example.com',
          DEFAULT_ACCOUNT_PASS,
        );
        petitionerToken = results.AuthenticationResult.IdToken;
      });

      it('should be able to login', () => {
        login(petitionerToken);
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
          submitPetition(caseTestData);
          goToDashboard();
        });
      });

      describe('should be able to create another case', () => {
        after(() => {
          [firstDocketNumber, secondDocketNumber] = caseTestData.docketNumbers;
        });

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
          submitPetition(caseTestData);
          goToDashboard();
        });
      });
    });
  });

  describe('should be able to create two trial sessions', () => {
    beforeEach(() => {
      cy.intercept({ method: 'POST', url: '/trial-sessions' }).as(
        'postTrialSession',
      );
    });

    it('should be able to login as petitions clerk', () => {
      login(petitionsClerkToken);
    });

    it('creates two trial sessions', () => {
      createTrialSession(testData);
      createTrialSession(testData);
    });

    it('navigates to the first newly-created trial session', () => {
      goToTrialSession(testData.trialSessionIds[0]);
    });
  });

  describe('after a new trial session is created', () => {
    // these are separated into their own steps so if they fail
    // they can be rerun without affecting other steps in the test
    it('view case detail for first case', () => {
      goToCaseOverview(firstDocketNumber);
    });

    it('is possible to manually add, view, and remove first case from an UNSET trial session', () => {
      manuallyAddCaseToNewTrialSession(testData.trialSessionIds[0]);
      removeCaseFromTrialSession();
    });

    it('view case detail for second case', () => {
      goToCaseOverview(secondDocketNumber);
    });

    it('manually block second case', () => {
      // block it
      blockCaseFromTrial();
      // do this well before we look for it on blocked cases report...
    });

    it('sets the first trial session as calendared', () => {
      setTrialSessionAsCalendared(testData.trialSessionIds[0]);
    });

    it('view case detail for first case', () => {
      goToCaseOverview(firstDocketNumber);
    });

    it('manually add, view, and remove first case from the SET trial session', () => {
      manuallyAddCaseToCalendaredTrialSession(testData.trialSessionIds[0]);
      removeCaseFromTrialSession();
    });

    it('view Blocked report containing second case, and unblock second case', () => {
      // enough time has elapsed since we blocked second case. look for it on blocked cases report
      // warning: if there are elasticsearch delays, this test might be brittle...
      // view blocked report
      viewBlockedCaseOnBlockedReport({
        ...testData,
        docketNumber: secondDocketNumber,
      });
    });

    it('view case detail for second case', () => {
      goToCaseOverview(secondDocketNumber);
    });

    it('unblock second case', () => {
      unblockCaseFromTrial();
    });

    it('login as docket clerk', () => {
      login(docketClerkToken);
    });

    it('view case detail for second case', () => {
      goToCaseOverview(secondDocketNumber);
    });

    it('set second case as High Priority for a trial session', () => {
      setCaseAsReadyForTrial(secondDocketNumber);
      setCaseAsHighPriority();
    });

    it('login as petitions clerk', () => {
      login(petitionsClerkToken);
    });

    it('complete QC of eligible (second) case and set calendar for second trial session', () => {
      goToTrialSession(testData.trialSessionIds[1]);
      markCaseAsQcCompleteForTrial(secondDocketNumber);

      // set as calendared
      setTrialSessionAsCalendared(testData.trialSessionIds[1]);
      verifyOpenCaseOnTrialSession(secondDocketNumber);
    });

    it('run Trial Session Planning Report', () => {
      runTrialSessionPlanningReport();
    });
  });
});
