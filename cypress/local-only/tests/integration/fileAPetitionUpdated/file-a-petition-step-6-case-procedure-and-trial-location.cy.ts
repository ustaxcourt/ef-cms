import { PROCEDURE_TYPES_MAP } from '../../../../../shared/src/business/entities/EntityConstants';
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
  });

  describe('Case Procedure and Trial Location', () => {
    describe('Edit step 4', () => {
      it('should navigate to petition flow step 4 when user clicks on edit button', () => {
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);
        cy.get('[data-testid="edit-petition-section-button-4"]').click();
        cy.get('[data-testid="step-indicator-current-step-4-icon"]').should(
          'be.visible',
        );
      });
    });
    describe('Case Procedure and Trial Location', () => {
      it('should display Case Procedure and Trial Location information correctly for regular case', () => {
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);
        cy.get('[data-testid="procedure-type"]').should('have.text', 'Regular');
        cy.get('[data-testid="trial-location"]').should(
          'have.text',
          'Birmingham, Alabama',
        );
      });

      it('should display Case Procedure and Trial Location information correctly for small case', () => {
        fillCaseProcedureInformation(PROCEDURE_TYPES_MAP.small);
        fillStinInformation(VALID_FILE);
        cy.get('[data-testid="procedure-type"]').should(
          'have.text',
          PROCEDURE_TYPES_MAP.small,
        );
        cy.get('[data-testid="trial-location"]').should(
          'have.text',
          'Birmingham, Alabama',
        );
      });
    });
  });
});
