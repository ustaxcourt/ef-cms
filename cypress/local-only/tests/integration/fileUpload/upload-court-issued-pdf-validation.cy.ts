import { goToCase } from '../../../../helpers/caseDetail/go-to-case';

import { MAX_FILE_SIZE_MB } from '../../../../../shared/src/business/entities/EntityConstants';
import { attachFile } from '../../../../helpers/file/upload-file';
import { loginAsDocketClerk1 } from '../../../../helpers/authentication/login-as-helpers';

describe('upload court issued document validations', () => {
  const docketNumber = '102-67'; // Any existing docket number works

  beforeEach(() => {
    loginAsDocketClerk1();
    goToCase(docketNumber);
    cy.get('[data-testid="case-detail-menu-button"]').click();
    cy.get('[data-testid="menu-button-upload-pdf"]').click();
  });

  it('should display error modal when a non-pdf file is selected and see no file selected after closing modal', () => {
    cy.intercept('POST', '/logError').as('logErrorRequest');

    attachFile({
      filePath: '../../helpers/file/non-pdf.txt',
      selector: '[data-testid="primary-document-file"]',
    });
    cy.wait('@logErrorRequest');

    cy.get('@logErrorRequest.all').should('have.length', 1);
    cy.get('[data-testid="file-upload-error-modal"]').contains(
      'The file is not a PDF. Select a PDF file or resave the file as a PDF.',
    );
    cy.get('[data-testid="modal-button-confirm"').click();
    cy.get('[data-testid^="upload-file-success"]').should('not.exist');
  });

  it('should display error modal when a non-supported pdf format is selected', () => {
    cy.intercept('POST', '/logError').as('logErrorRequest');

    attachFile({
      filePath: '../../helpers/file/corrupt-pdf.pdf',
      selector: '[data-testid="primary-document-file"]',
    });
    cy.wait('@logErrorRequest');

    cy.get('@logErrorRequest.all').should('have.length', 1);
    cy.get('[data-testid="file-upload-error-modal"]').contains(
      'The file is corrupted or in an unsupported PDF format. Ensure that the file is not corrupted and/or is in a supported PDF format and try again.',
    );
  });

  it('should display error modal when a password-protected pdf is selected', () => {
    cy.intercept('POST', '/logError').as('logErrorRequest');

    attachFile({
      filePath: '../../helpers/file/password-protected-pdf.pdf',
      selector: '[data-testid="primary-document-file"]',
    });
    cy.wait('@logErrorRequest');

    cy.get('@logErrorRequest.all').should('have.length', 1);
    cy.get('[data-testid="file-upload-error-modal"]').contains(
      'The file is encrypted or password protected. Remove encryption or password protection and try again.',
    );
  });

  it('should display error modal when a readonly pdf is selected', () => {
    cy.intercept('POST', '/logError').as('logErrorRequest');

    attachFile({
      encoding: 'binary',
      filePath: '../../helpers/file/readonly-pdf.pdf',
      selector: '[data-testid="primary-document-file"]',
    });
    cy.wait('@logErrorRequest');

    cy.get('@logErrorRequest.all').should('have.length', 1);
    cy.get('[data-testid="file-upload-error-modal"]').contains(
      'The file is encrypted or password protected. Remove encryption or password protection and try again.',
    );
  });

  it('should display error modal when a file larger than the limit is selected', () => {
    cy.intercept('POST', '/logError').as('logErrorRequest');
    const largeFile = new Blob(
      [new ArrayBuffer((MAX_FILE_SIZE_MB + 1) * 1024 * 1024)],
      {
        type: 'application/pdf',
      },
    );
    const fileName = 'large-file.pdf';

    // Trigger the file upload
    cy.get('[data-testid="primary-document-file"]').then(input => {
      const dataTransfer = new DataTransfer();
      const file = new File([largeFile], fileName, { type: largeFile.type });
      dataTransfer.items.add(file);
      (input[0] as HTMLInputElement).files = dataTransfer.files;
      cy.wrap(input).trigger('change', { force: true });
    });
    cy.wait('@logErrorRequest');

    cy.get('@logErrorRequest.all').should('have.length', 1);
    cy.get('[data-testid="file-upload-error-modal"]').contains(
      `The file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB. Reduce the file size and try again.`,
    );
  });

  it('should see success on valid pdf upload', () => {
    attachFile({
      filePath: '../../helpers/file/sample.pdf',
      selector: '[data-testid="primary-document-file"]',
    });

    cy.get('[data-testid^="upload-file-success"]').should('exist');
  });
});
