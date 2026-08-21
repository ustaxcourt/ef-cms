import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';

describe('PetitionQcScanBatchPreviewer', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', err => {
      if (err.message.includes('Scanner interface has not been initialized')) {
        return false;
      }
    });
    return createAndServePaperPetition().then(({ docketNumber }) => {
      loginAsPetitionsClerk();
      goToCase(docketNumber);
      cy.visit(`/case-detail/${docketNumber}/petition-qc`);
      cy.get('[data-testid="petition-qc-page-heading"]').should('exist');
      cy.get('[data-testid="scanner-area-header"]', { timeout: 15000 }).should(
        'exist',
      );
      cy.get('[data-testid="remove-pdf"]')
        .should('exist')
        .click();
      cy.get('[data-testid="modal-button-confirm"]').click();
    });
  });

  it('should display scanner area header', () => {
    cy.get('[data-testid="scanner-area-header"]').should('exist');
  });

  it('should display scan mode radio button', () => {
    cy.get('[data-testid="upload-mode-scan"]').should('exist');
  });

  it('should NOT display file input', () => {
    cy.get('[data-testid="petitionFile-file-input"]').should('not.exist');
  });

  it('should allow selecting scan mode', () => {
    cy.get('[data-testid="scan-mode-radio"]').check();
    cy.get('[data-testid="scan-mode-radio"]').should('be.checked');
    cy.get('[data-testid="scanner-area-header"]').should('be.visible');
    cy.get('[data-testid="scanner-area-header"]')
      .contains('button', 'Select Scanner')
      .should('be.visible');
  });
});
