import { confirmUser } from '../support/pages/login';
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
const { closeScannerSetupDialog, getUserToken, login } =
  getEnvironmentSpecificFunctions();

let token = null;
const testData = {};

const DEFAULT_ACCOUNT_PASS = Cypress.env('DEFAULT_ACCOUNT_PASS');
const randomizedEmail = `${faker.string.uuid()}@example.com`;

if (!Cypress.env('SMOKETESTS_LOCAL')) {
  describe('Petitions clerk', () => {
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

    it('should be able to create a case with paper service', () => {
      goToMyDocumentQC();
      goToCreateCase();
      closeScannerSetupDialog();
      fillInCreateCaseFromPaperForm();
      goToReviewCase(testData);
      serveCaseToIrs();
    });
  });

  describe('Admission clerk', () => {
    before(async () => {
      const results = await getUserToken(
        'admissionsclerk1@example.com',
        DEFAULT_ACCOUNT_PASS,
      );
      token = results.AuthenticationResult.IdToken;
    });

    it('should be able to login', () => {
      login(token);
    });

    // possibly create a new petitioner or generate a new user within the test (AND CLEAN UP)

    it('should add an email to the party on the case', () => {
      goToCaseDetail(testData.createdPaperDocketNumber);

      editPetitionerEmail(randomizedEmail);
    });
  });

  describe('Petitioner', () => {
    it('should confirm user', async () => {
      await confirmUser({ email: randomizedEmail });
    });

    it('verify the email has changed', async () => {
      const results = await getUserToken(randomizedEmail, DEFAULT_ACCOUNT_PASS);
      token = results.AuthenticationResult.IdToken;
      login(token);
      goToCaseDetailPetitioner(testData.createdPaperDocketNumber);
      verifyEmailChange();
    });
  });

  // TODO: WRITE A DEVEX TASK TO CLEAN UP MOCK USERS CREATED FROM SMOKETESTS
} else {
  describe('we do not want this test to run locally, so we mock out a test to make it skip', () => {
    it('should skip', () => {
      expect(true).to.equal(true);
    });
  });
}
