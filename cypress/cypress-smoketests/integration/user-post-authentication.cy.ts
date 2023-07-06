import { AuthenticationResult } from '../../support/login-types';
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

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');
const randomizedEmail = `${faker.string.uuid()}@example.com`;

if (!Cypress.env('SMOKETESTS_LOCAL')) {
  describe('Petitions clerk', () => {
    it('should be able to create a case with paper service', () => {
      cy.task<AuthenticationResult>('getUserToken', {
        email: 'petitionsclerk1@example.com',
        password: DEFAULT_ACCOUNT_PASS,
      }).then(result => {
        login(result.AuthenticationResult?.IdToken);
      });
      goToMyDocumentQC();
      goToCreateCase();
      closeScannerSetupDialog();
      fillInCreateCaseFromPaperForm();
      goToReviewCase().then(docketNumber => {
        serveCaseToIrs();
        cy.task<AuthenticationResult>('getUserToken', {
          email: 'admissionsclerk1@example.com',
          password: DEFAULT_ACCOUNT_PASS,
        }).then(result => {
          login(result.AuthenticationResult?.IdToken);
        });
        goToCaseDetail(docketNumber);
        editPetitionerEmail(randomizedEmail);
        cy.task('confirmUser', { email: randomizedEmail });

        cy.task('waitForNoce', { docketNumber }).then(isNOCECreated => {
          expect(isNOCECreated).to.equal(true);
        });

        cy.task<AuthenticationResult>('getUserToken', {
          email: randomizedEmail,
          password: DEFAULT_ACCOUNT_PASS,
        }).then(result => {
          login(result.AuthenticationResult?.IdToken);
        });
        goToCaseDetailPetitioner(docketNumber);
        verifyEmailChange();
      });
    });
  });
} else {
  describe('we do not want this test to run locally, so we mock out a test to make it skip', () => {
    it('should skip', () => {
      expect(true).to.equal(true);
    });
  });
}
