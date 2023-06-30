import { AuthenticationResult } from '../../support/login-types';
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
import { faker } from '@faker-js/faker';
import { fillInCreateCaseFromPaperForm } from '../../cypress-integration/support/pages/create-paper-petition';
import { getEnvironmentSpecificFunctions } from '../support/pages/environment-specific-factory';
import {
  goToCreateCase,
  goToReviewCase,
  saveCaseForLater,
  serveCaseToIrs,
} from '../support/pages/create-paper-case';
import { goToMyDocumentQC } from '../support/pages/document-qc';

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');

let token: string;

const { closeScannerSetupDialog, login } = getEnvironmentSpecificFunctions();

describe('Petitioner', () => {
  before(() => {
    cy.task<AuthenticationResult>('getUserToken', {
      email: 'petitioner1@example.com',
      password: DEFAULT_ACCOUNT_PASS,
    }).then(result => {
      token = result.AuthenticationResult.IdToken;
    });
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
        `${faker.person.firstName()} ${faker.person.lastName()}`,
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
  before(() => {
    cy.task<AuthenticationResult>('getUserToken', {
      email: 'privatePractitioner1@example.com',
      password: DEFAULT_ACCOUNT_PASS,
    }).then(result => {
      token = result.AuthenticationResult.IdToken;
    });
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
        `${faker.person.firstName()} ${faker.person.lastName()}`,
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
  before(() => {
    cy.task<AuthenticationResult>('getUserToken', {
      email: 'petitionsclerk1@example.com',
      password: DEFAULT_ACCOUNT_PASS,
    }).then(result => {
      token = result.AuthenticationResult.IdToken;
    });
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
