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
  checkA11y,
  DAWSON_GLOBAL_DISABLED_AXE_ERRORS,
} = require('../support/accessibility');
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
const { faker } = require('@faker-js/faker');

faker.seed(faker.datatype.number());

const testData = {
  docketNumbers: [],
  judgeName: 'Cohen',
  preferredTrialCity: 'Boise, Idaho',
  trialClerk: 'Test Trial Clerk',
  trialSessionIds: [],
};

const firstCasePetitionerName = `${faker.name.firstName()} ${faker.name.lastName()}`;
const secondCasePetitionerName = `${faker.name.firstName()} ${faker.name.lastName()}`;

describe('Petitioner', () => {
  describe(`should create a case for ${firstCasePetitionerName}`, () => {
    it('should complete wizard step 1', () => {
      cy.login('petitioner');
      goToStartCreatePetition();
      checkA11y({ ignoredErrors: DAWSON_GLOBAL_DISABLED_AXE_ERRORS });

      goToWizardStep1();
      checkA11y({ ignoredErrors: DAWSON_GLOBAL_DISABLED_AXE_ERRORS });

      completeWizardStep1();
    });

    // this is in its own step because sometimes the click fails, and if it's in its own step it will retry properly
    it('should go to wizard step 2', () => {
      goToWizardStep2();
      checkA11y({
        ignoredErrors: DAWSON_GLOBAL_DISABLED_AXE_ERRORS,
      });
    });

    it('should complete the form and submit the petition', () => {
      completeWizardStep2(hasIrsNotice.NO, 'Innocent Spouse');
      goToWizardStep3();
      checkA11y({ ignoredErrors: DAWSON_GLOBAL_DISABLED_AXE_ERRORS });

      completeWizardStep3(filingTypes.INDIVIDUAL, firstCasePetitionerName);
      goToWizardStep4();
      checkA11y({ ignoredErrors: DAWSON_GLOBAL_DISABLED_AXE_ERRORS });

      completeWizardStep4();
      goToWizardStep5();
      checkA11y({ ignoredErrors: DAWSON_GLOBAL_DISABLED_AXE_ERRORS });

      submitPetition(testData);
      goToDashboard();
      checkA11y({
        ignoredErrors: {
          'aria-hidden-focus': { enabled: false },
          'color-contrast': { enabled: false },
          'landmark-one-main': { enabled: false },
          'nested-interactive': { enabled: false },
          'page-has-heading-one': { enabled: false },
          ...DAWSON_GLOBAL_DISABLED_AXE_ERRORS,
        },
      });
    });
  });

  describe(`should create a case for ${secondCasePetitionerName}`, () => {
    it('should complete wizard step 1', () => {
      cy.login('petitioner3');
      goToStartCreatePetition();
      checkA11y({ ignoredErrors: DAWSON_GLOBAL_DISABLED_AXE_ERRORS });

      goToWizardStep1();
      checkA11y({ ignoredErrors: DAWSON_GLOBAL_DISABLED_AXE_ERRORS });

      completeWizardStep1();
    });

    // this is in its own step because sometimes the click fails, and if it's in its own step it will retry properly
    it('should go to wizard step 2', () => {
      goToWizardStep2();
      checkA11y({
        ignoredErrors: DAWSON_GLOBAL_DISABLED_AXE_ERRORS,
        options: { skipFailures: true },
      });
    });

    it('should complete the form and submit the petition', () => {
      completeWizardStep2(hasIrsNotice.NO, 'Innocent Spouse');
      goToWizardStep3();
      checkA11y({ ignoredErrors: DAWSON_GLOBAL_DISABLED_AXE_ERRORS });

      completeWizardStep3(filingTypes.INDIVIDUAL, secondCasePetitionerName);
      goToWizardStep4();
      checkA11y({ ignoredErrors: DAWSON_GLOBAL_DISABLED_AXE_ERRORS });

      completeWizardStep4();
      goToWizardStep5();
      checkA11y({ ignoredErrors: DAWSON_GLOBAL_DISABLED_AXE_ERRORS });

      submitPetition(testData);
      goToDashboard();
      checkA11y({
        ignoredErrors: {
          'aria-hidden-focus': { enabled: false },
          'color-contrast': { enabled: false },
          'landmark-one-main': { enabled: false },
          'nested-interactive': { enabled: false },
          'page-has-heading-one': { enabled: false },
          ...DAWSON_GLOBAL_DISABLED_AXE_ERRORS,
        },
      });
    });
  });
});

describe('Petitions Clerk', () => {
  beforeEach(() => {
    cy.intercept({ method: 'POST', url: '/trial-sessions' }).as(
      'postTrialSession',
    );
  });

  it('creates a trial session', () => {
    cy.login('petitionsclerk', '/add-a-trial-session');
    createTrialSession(testData);
  });

  it(`manually adds ${firstCasePetitionerName}'s case to trial session`, () => {
    goToCaseOverview(testData.docketNumbers[0]);
    manuallyAddCaseToNewTrialSession(testData.trialSessionIds[0]);
  });

  it(`manually adds ${secondCasePetitionerName}'s case to trial session`, () => {
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

describe('Judge', () => {
  it('views trial session working copy', () => {
    cy.login(
      'judgeCohen',
      `/trial-session-working-copy/${testData.trialSessionIds[0]}`,
    );
  });

  it('views all cases on the trial session', () => {
    cy.get('label[for="filters.showAll"]').click();
    cy.get('label[for="filters.showAll"]').click();
  });

  it('changes the trial status of the first case on the trial session', () => {
    changeCaseTrialStatus(testData.docketNumbers[0]);
  });

  it('filters cases by trial status "Set for Trial"', () => {
    filterWorkingCopyByStatus({
      docketNumberShouldExist: testData.docketNumbers[1],
      docketNumberShouldNotExist: testData.docketNumbers[0],
      status: 'Set for Trial',
    });
  });

  it('adds a case note for the second case on the trial session', () => {
    addCaseNote(testData.docketNumbers[1], 'Judge case note');
  });
});

describe('Judge Chambers', () => {
  it('views trial session working copy', () => {
    cy.login(
      'cohensChambers',
      `/trial-session-working-copy/${testData.trialSessionIds[0]}`,
    );
  });

  it('views all cases on the trial session', () => {
    cy.get('label[for="filters.showAll"]').click();
  });

  it('changes the trial status of the second case on the trial session', () => {
    changeCaseTrialStatus(testData.docketNumbers[1], 'Continued');
  });

  it('filters cases by trial status "Continued"', () => {
    filterWorkingCopyByStatus({
      docketNumberShouldExist: testData.docketNumbers[0],
      docketNumberShouldNotExist: testData.docketNumbers[1],
      status: 'Continued',
    });
  });

  it('adds a case note for the first case on the trial session', () => {
    addCaseNote(testData.docketNumbers[0], 'Chambers case note');
  });
});
