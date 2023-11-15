import { AuthenticationResult } from '../../support/login-types';
import {
  blockCaseFromTrial,
  goToCaseDetail,
  goToCaseOverview,
  manuallyAddCaseToCalendaredTrialSession,
  manuallyAddCaseToNewTrialSession,
  removeCaseFromTrialSession,
  reviewAndServePetition,
  setCaseAsHighPriority,
  setCaseAsReadyForTrial,
  unblockCaseFromTrial,
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
import {
  createTrialSession,
  goToCreateTrialSession,
  goToTrialSession,
  goToTrialSessions,
  markCaseAsQcCompleteForTrial,
  setTrialSessionAsCalendared,
  verifyOpenCaseOnTrialSession,
} from '../support/pages/trial-sessions';
import { faker } from '@faker-js/faker';
import { getEnvironmentSpecificFunctions } from '../support/environment-specific-factory';
import {
  runTrialSessionPlanningReport,
  viewBlockedCaseOnBlockedReport,
} from '../support/pages/reports';
import { waitForElasticsearch } from '../support/helpers';

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');

faker.seed(faker.number.int());

let docketClerkToken: string;
let petitionsClerkToken: string;
const testData = {
  preferredTrialCity: 'Mobile, Alabama',
  trialSessionIds: [],
};
const { login } = getEnvironmentSpecificFunctions();

let firstDocketNumber: string;
let secondDocketNumber: string;
const caseTestData: { docketNumbers: string[] } = { docketNumbers: [] };

describe('Petitions Clerk', () => {
  before(() => {
    cy.task<AuthenticationResult>('getUserToken', {
      email: 'petitionsclerk1@example.com',
      password: DEFAULT_ACCOUNT_PASS,
    }).then(result => {
      petitionsClerkToken = result.AuthenticationResult.IdToken;
    });
  });

  before(() => {
    cy.task<AuthenticationResult>('getUserToken', {
      email: 'docketclerk1@example.com',
      password: DEFAULT_ACCOUNT_PASS,
    }).then(result => {
      docketClerkToken = result.AuthenticationResult.IdToken;
    });
  });

  describe('Petitioner creates cases', () => {
    let petitionerToken: string;

    describe('Petitioner', () => {
      before(() => {
        cy.task<AuthenticationResult>('getUserToken', {
          email: 'petitioner1@example.com',
          password: DEFAULT_ACCOUNT_PASS,
        }).then(result => {
          petitionerToken = result.AuthenticationResult.IdToken;
        });
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
            `${faker.person.firstName()} ${faker.person.lastName()}`,
          );
          goToWizardStep4();
          completeWizardStep4();
          goToWizardStep5();
          submitPetition().then(createdPaperDocketNumber => {
            caseTestData.docketNumbers.push(createdPaperDocketNumber);
          });
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
            `${faker.person.firstName()} ${faker.person.lastName()}`,
          );
          goToWizardStep4();
          completeWizardStep4();
          goToWizardStep5();
          submitPetition().then(createdPaperDocketNumber => {
            caseTestData.docketNumbers.push(createdPaperDocketNumber);
          });
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

    it('creates a trial session with an offboarded judge', () => {
      const overrides = {
        offboardedJudge: 'Guy',
      };

      goToTrialSessions();
      goToCreateTrialSession();
      createTrialSession(testData, overrides);
    });

    it('creates a trial session with an existing judge', () => {
      goToTrialSessions();
      goToCreateTrialSession();
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
      goToCaseDetail(firstDocketNumber);
    });

    it('serve first case to irs', () => {
      reviewAndServePetition();
    });

    it('is possible to manually add, view, and remove first case from an UNSET trial session', () => {
      goToCaseOverview(firstDocketNumber);
      manuallyAddCaseToNewTrialSession(testData.trialSessionIds[0]);
      removeCaseFromTrialSession();
    });

    it('view case detail for second case', () => {
      goToCaseDetail(secondDocketNumber);
    });

    it('serve second case to irs', () => {
      reviewAndServePetition();
    });

    it('manually block second case', () => {
      goToCaseOverview(secondDocketNumber);
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
      waitForElasticsearch();
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
      setCaseAsReadyForTrial();
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
