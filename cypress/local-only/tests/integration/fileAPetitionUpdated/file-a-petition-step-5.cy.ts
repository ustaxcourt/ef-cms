import { attachFile } from '../../../../helpers/file/upload-file';
import {
  fillCaseProcedureInformation,
  fillIrsNoticeInformation,
  fillPetitionFileInformation,
  fillPetitionerInformation,
} from './petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition - Step 5 Statement of Taxpayer Identification Number', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');

    fillPetitionerInformation();
    fillPetitionFileInformation(VALID_FILE);
    fillIrsNoticeInformation(VALID_FILE);
    fillCaseProcedureInformation();
  });

  it('should display validation error message when user presses "Next" button without uploading stin file', () => {
    const ERROR_MESSAGE_DATA_TEST_ID = ['stin-file-error-message-0'];
    cy.get(`[data-testid="${ERROR_MESSAGE_DATA_TEST_ID}"]`).should('not.exist');
    cy.get('[data-testid="step-5-next-button"]').click();
    cy.get(`[data-testid="${ERROR_MESSAGE_DATA_TEST_ID}"]`).should('exist');
  });

  it('should allow user to go to step 6 if stin file is uploaded', () => {
    attachFile({
      filePath: VALID_FILE,
      selector: '[data-testid="stin-file"]',
      selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
    });

    cy.get('[data-testid="step-5-next-button"]').click();
    cy.get('[data-testid="step-indicator-current-step-6-icon"]');
  });
});
