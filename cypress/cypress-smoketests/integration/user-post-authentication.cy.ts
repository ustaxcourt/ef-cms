import { AuthenticationResult } from '../support/pages/local-login';
import {
  editPetitionerEmail,
  goToCaseDetail,
  verifyEmailChange,
} from '../support/pages/case-detail';
import { faker } from '@faker-js/faker';
import { fillInCreateCaseFromPaperForm } from '../../cypress-integration/support/pages/create-paper-petition';
import { getEnvironmentSpecificFunctions } from '../support/pages/environment-specific-factory';
import { goToCaseDetailPetitioner } from '../support/pages/petitioner-dashboard';
import {
  goToCreateCase,
  goToReviewCase,
  serveCaseToIrs,
} from '../support/pages/create-paper-case';
import { goToMyDocumentQC } from '../support/pages/document-qc';
const { closeScannerSetupDialog, login } = getEnvironmentSpecificFunctions();

let token: string;
let createdCaseDocketNumber: string;
const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');
const randomizedEmail = `${faker.string.uuid()}@example.com`;

if (!Cypress.env('SMOKETESTS_LOCAL')) {
  describe('Petitions clerk', () => {
    before(() => {
      cy.task<AuthenticationResult>('getUserToken', {
        email: 'petitionsclerk1@example.com',
        password: DEFAULT_ACCOUNT_PASS,
      }).then(result => {
        token = result.AuthenticationResult?.IdToken;
      });
    });

    it('should be able to login', () => {
      login(token);
    });

    it('should be able to create a case with paper service', () => {
      goToMyDocumentQC();
      goToCreateCase();
      closeScannerSetupDialog();
      fillInCreateCaseFromPaperForm();
      goToReviewCase().then(
        createdDocket => (createdCaseDocketNumber = createdDocket),
      );
      serveCaseToIrs();
    });
  });

  describe('Admission clerk', () => {
    before(() => {
      cy.task<AuthenticationResult>('getUserToken', {
        email: 'admissionsclerk1@example.com',
        password: DEFAULT_ACCOUNT_PASS,
      }).then(result => {
        token = result.AuthenticationResult?.IdToken;
      });
    });

    it('should be able to login', () => {
      login(token);
    });

    it('should add an email to the party on the case', () => {
      goToCaseDetail(createdCaseDocketNumber);
      editPetitionerEmail(randomizedEmail);
    });

    it('should confirm user', () => {
      cy.task('confirmUser', { email: randomizedEmail });
    });
  });

  describe('Petitioner', () => {
    before(() => {
      cy.task<AuthenticationResult>('getUserToken', {
        email: randomizedEmail,
        password: DEFAULT_ACCOUNT_PASS,
      }).then(result => {
        token = result.AuthenticationResult?.IdToken;
      });
    });

    it(
      'Verifies Petitioner Email Change',
      {
        retries: {
          openMode: 3, // This test is running three times as the email verification process is async and there is no convenient way to check when it is finished and NOCE has been docketed.
          runMode: 3,
        },
      },
      () => {
        cy.log('Running login');
        login(token);
        goToCaseDetailPetitioner(createdCaseDocketNumber);
        verifyEmailChange();
      },
    );
  });
} else {
  describe('we do not want this test to run locally, so we mock out a test to make it skip', () => {
    it('should skip', () => {
      expect(true).to.equal(true);
    });
  });
}
