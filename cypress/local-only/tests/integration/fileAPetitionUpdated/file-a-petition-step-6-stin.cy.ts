import {
  fillCaseProcedureInformation,
  fillIrsNoticeInformation,
  fillPetitionFileInformation,
  fillPetitionerInformation,
  fillStinInformation,
} from './petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition - Step 6 Review & Submit Case', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
    fillPetitionerInformation();
    fillPetitionFileInformation(VALID_FILE);
    fillIrsNoticeInformation(VALID_FILE);
    fillCaseProcedureInformation();
    fillStinInformation(VALID_FILE);
  });

  describe('Statement of Taxpayer Identification Number', () => {
    describe('Edit step 5', () => {
      it('should navigate to petition flow step 5 when user clicks on edit button', () => {
        cy.get('[data-testid="edit-petition-section-button-5"]').click();
        cy.get('[data-testid="step-indicator-current-step-5-icon"]').should(
          'be.visible',
        );
      });
    });
    describe('Statement of Taxpayer Identification Number', () => {
      it('should display preview of uploaded stin file', () => {
        cy.get('[data-testid="stin-preview-button"]').should(
          'have.text',
          'sample.pdf',
        );
      });
    });
  });
});
