import { attachFile } from '../../../../helpers/file/upload-file';
import { loginAsPetitionsClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('ScanBatchPreviewer', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    cy.on('uncaught:exception', err => {
      if (err.message.includes('Scanner interface has not been initialized')) {
        return false;
      }
    });
    loginAsPetitionsClerk();
    cy.visit('/document-qc');
    cy.get('[data-testid="start-a-petition"]').click();
    cy.get('[data-testid="tab-case-info"]').should('exist');
    cy.get('[data-testid="scanner-area-header"]', { timeout: 15000 }).should(
      'exist',
    );
  });

  it('should display scanner area header', () => {
    cy.get('[data-testid="scanner-area-header"]').should('exist');
  });

  it('should display scan mode radio button', () => {
    cy.get('[data-testid="upload-mode-scan"]').should('exist');
  });

  it('should display upload mode radio button', () => {
    cy.get('[data-testid="upload-pdf-button"]').should('exist');
  });

  it('should allow selecting scan mode', () => {
    cy.get('[data-testid="upload-mode-scan"]')
      .should('be.visible')
      .scrollIntoView();
    cy.get('[data-testid="upload-mode-scan"]').click();
    cy.get('[data-testid="scan-mode-radio"]').should('be.checked');
    cy.get('[data-testid="scanner-area-header"]').should('be.visible');
    cy.get('[data-testid="scanner-area-header"]')
      .contains('button', 'Select Scanner')
      .should('be.visible');
  });

  it('should display file input when upload mode is selected', () => {
    cy.get('[data-testid="upload-pdf-button"]')
      .should('be.visible')
      .scrollIntoView();
    cy.get('[data-testid="upload-pdf-button"]').click();
    cy.get('[data-testid="upload-mode-radio"]').should('be.checked');
    cy.get('[data-testid="petitionFile-file-input"]').should('exist');
  });

  it('should allow switching between scan and upload modes', () => {
    cy.get('[data-testid="upload-mode-scan"]')
      .should('be.visible')
      .scrollIntoView();
    cy.get('[data-testid="upload-mode-scan"]').click();
    cy.get('[data-testid="scan-mode-radio"]').should('be.checked');

    cy.get('[data-testid="upload-pdf-button"]')
      .should('be.visible')
      .scrollIntoView();
    cy.get('[data-testid="upload-pdf-button"]').click();
    cy.get('[data-testid="upload-mode-radio"]').should('be.checked');
    cy.get('[data-testid="petitionFile-file-input"]').should('exist');

    cy.get('[data-testid="upload-mode-scan"]')
      .should('be.visible')
      .scrollIntoView();
    cy.get('[data-testid="upload-mode-scan"]').click();
    cy.get('[data-testid="scan-mode-radio"]').should('be.checked');
  });

  it('should allow uploading PDF in upload mode', () => {
    cy.get('[data-testid="upload-pdf-button"]')
      .should('be.visible')
      .scrollIntoView();
    cy.get('[data-testid="upload-pdf-button"]').click();
    cy.get('[data-testid="upload-mode-radio"]').should('be.checked');
    attachFile({
      filePath: VALID_FILE,
      selector: '[data-testid="petitionFile-file-input"]',
      selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
    });
  });

  it('should display validation errors when file upload fails', () => {
    cy.intercept('POST', '/logError').as('logErrorRequest');

    cy.get('[data-testid="upload-pdf-button"]')
      .should('be.visible')
      .scrollIntoView();
    cy.get('[data-testid="upload-pdf-button"]').click();
    cy.get('[data-testid="upload-mode-radio"]').should('be.checked');
    attachFile({
      filePath: '../../helpers/file/non-pdf.txt',
      selector: '[data-testid="petitionFile-file-input"]',
    });
    cy.wait('@logErrorRequest');

    cy.get('@logErrorRequest.all').should('have.length', 1);
    cy.get('[data-testid="file-upload-error-modal"]').should('exist');
  });
});
