import {
  fillCaseProcedureInformation,
  fillGeneratePetitionFileInformation,
  fillIrsNotice,
  fillPetitionFileInformation,
  fillPetitionerInformation,
  fillStinInformation,
} from './petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
  });

  describe('Link Text for Petition', () => {
    it('should display "Preview in full screen" for petition when user generated a Petition file', () => {
      fillPetitionerInformation();
      fillGeneratePetitionFileInformation();

      cy.get('[data-testid="irs-notice-Yes"]').click();

      cy.get('[data-testid="add-another-irs-notice-button"]').click();
      cy.get('[data-testid="add-another-irs-notice-button"]').click();

      fillIrsNotice(0, VALID_FILE);
      fillIrsNotice(1, VALID_FILE);
      fillIrsNotice(2, VALID_FILE);

      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="step-3-next-button"]').click();

      fillCaseProcedureInformation();

      fillStinInformation(VALID_FILE);

      cy.get('[data-testid="preview-petition-file-button-link"]').should(
        'have.text',
        'Preview in full screen',
      );
    });

    it('should display the file name for petition when user uploads a PDF file', () => {
      fillPetitionerInformation();
      fillPetitionFileInformation(VALID_FILE);

      cy.get('[data-testid="irs-notice-Yes"]').click();

      cy.get('[data-testid="add-another-irs-notice-button"]').click();
      cy.get('[data-testid="add-another-irs-notice-button"]').click();

      fillIrsNotice(0, VALID_FILE);
      fillIrsNotice(1, VALID_FILE);
      fillIrsNotice(2, VALID_FILE);

      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="step-3-next-button"]').click();

      fillCaseProcedureInformation();

      fillStinInformation(VALID_FILE);

      cy.get('[data-testid="preview-petition-file-button-link"]').should(
        'have.text',
        'sample.pdf',
      );
    });
  });
});
