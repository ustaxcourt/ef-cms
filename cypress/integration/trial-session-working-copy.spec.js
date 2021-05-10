const faker = require('faker');
const {
  addCaseNote,
  changeCaseTrialStatus,
  createTrialSession,
  filterWorkingCopyByStatus,
  goToTrialSession,
  markCaseAsQcCompleteForTrial,
  setTrialSessionAsCalendared,
} = require('../../cypress-smoketests/support/pages/trial-sessions');
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
} = require('../../cypress-smoketests/support/pages/create-electronic-petition');
const {
  goToCaseOverview,
  manuallyAddCaseToNewTrialSession,
} = require('../../cypress-smoketests/support/pages/case-detail');

faker.seed(faker.datatype.number());

const testData = {
  docketNumbers: [],
  judgeName: 'Cohen',
  preferredTrialCity: 'Boise, Idaho',
  trialClerk: 'Test Trial Clerk',
  trialSessionIds: [],
};

describe.skip('Petitioner', () => {
  describe('should be able to create the first case', () => {
    it('should complete wizard step 1', () => {
      cy.login('petitioner');
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

// eslint-disable-next-line no-unused-vars
let judgeUserId;
describe.skip('Petitions Clerk', () => {
  describe('should create and set a trial session', () => {
    beforeEach(() => {
      cy.intercept({ method: 'POST', url: '/trial-sessions' }).as(
        'postTrialSession',
      );
    });

    it('creates a trial session', () => {
      cy.login('petitionsclerk');
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
  it('should be able to login', () => {
    cy.login('judgeCohen');
  });

  it('views trial session working copy', () => {
    cy.goToRoute(`/trial-session-working-copy/${testData.trialSessionIds[0]}`);
  });

  it('clicks show all', () => {
    cy.get('label[for="filters.showAll"]').click();
    cy.get('label[for="filters.showAll"]').click();
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

describe.skip('Judge Chambers', () => {
  it('should be able to login', () => {
    cy.login('cohensChambers');
  });

  it('views trial session working copy', () => {
    cy.goToRoute(`/trial-session-working-copy/${testData.trialSessionIds[0]}`);
  });

  it('clicks show all', () => {
    cy.get('label[for="filters.showAll"]').click();
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
