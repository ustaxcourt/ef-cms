import {
  fillCaseProcedureInformation,
  fillGeneratePetitionFileInformation,
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
  });

  describe('Petition Information', () => {
    describe('Edit step 2', () => {
      it('should navigate to petition flow step 2 when user clicks on edit button', () => {
        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);
        cy.get('[data-testid="edit-petition-section-button-2"]').click();
        cy.get('[data-testid="step-indicator-current-step-2-icon"]').should(
          'be.visible',
        );
      });
    });
    describe('Uploaded petition', () => {
      it('should display preview of uploaded petition', () => {
        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);
        cy.get('[data-testid="petition-preview-button"]').should(
          'have.text',
          'sample.pdf',
        );
      });
    });

    describe('Generated petition', () => {
      it('should display facts and reasons', () => {
        fillGeneratePetitionFileInformation();
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);

        cy.get('[data-testid="petition-fact"]').should('have.text', 'FACT 1');
        cy.get('[data-testid="petition-reason"]').should(
          'have.text',
          'REASON 1',
        );
      });

      it('should display multiple facts and reasons', () => {
        fillGeneratePetitionFileInformation(true);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);
        cy.get('[data-testid="petition-fact"]').should('have.length', 2);
        cy.get('[data-testid="petition-fact"]')
          .eq(0)
          .should('have.text', 'FACT 1');
        cy.get('[data-testid="petition-fact"]')
          .eq(1)
          .should('have.text', 'FACT 2');

        cy.get('[data-testid="petition-reason"]').should('have.length', 2);
        cy.get('[data-testid="petition-reason"]')
          .eq(0)
          .should('have.text', 'REASON 1');
        cy.get('[data-testid="petition-reason"]')
          .eq(1)
          .should('have.text', 'REASON 2');
      });
    });
  });
});
