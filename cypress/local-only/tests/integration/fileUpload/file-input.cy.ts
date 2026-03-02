import { attachFile } from '../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { loginAsDocketClerk1, loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { MAX_FILE_SIZE_MB } from '@shared/business/entities/EntityConstants';

describe('FileInput', () => {
  const encoding = 'binary';
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    return externalUserCreatesElectronicCase().then(docketNumber => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-upload-pdf"]').click();
    });
  });

  it('should display file input with correct accept attribute', () => {
    cy.get('[data-testid="primary-document-file"]').should(
      'have.attr',
      'accept',
      '.pdf',
    );
  });

  it('should show success message on valid PDF upload', () => {
    attachFile({
      encoding,
      filePath: VALID_FILE,
      selector: '[data-testid="primary-document-file"]',
      selectorToAwaitOnSuccess: '[data-testid="upload-file-success-primary-document-file"]',
    });
  });

  it('should display error modal when non-PDF file is selected', () => {
    cy.intercept('POST', '/logError').as('logErrorRequest');

    attachFile({
      encoding,
      filePath: '../../helpers/file/non-pdf.txt',
      selector: '[data-testid="primary-document-file"]',
    });
    cy.wait('@logErrorRequest');

    cy.get('[data-testid="file-upload-error-modal"]').should('exist');
    cy.get('[data-testid="file-upload-error-modal"]').contains(
      'The file is not a PDF',
    );
    cy.get('[data-testid="modal-button-confirm"]').click();
  });

  it('should display error modal when file exceeds size limit', () => {
    cy.intercept('POST', '/logError').as('logErrorRequest');
    const largeFile = new Blob(
      [new ArrayBuffer((MAX_FILE_SIZE_MB + 1) * 1024 * 1024)],
      {
        type: 'application/pdf',
      },
    );
    const fileName = 'large-file.pdf';

    cy.get('[data-testid="primary-document-file"]').then(input => {
      const dataTransfer = new DataTransfer();
      const file = new File([largeFile], fileName, { type: largeFile.type });
      dataTransfer.items.add(file);
      (input[0] as HTMLInputElement).files = dataTransfer.files;
      cy.wrap(input).trigger('change', { force: true });
    });
    cy.wait('@logErrorRequest');

    cy.get('[data-testid="file-upload-error-modal"]').should('exist');
    cy.get('[data-testid="file-upload-error-modal"]').contains(
      `The file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB`,
    );
  });

  it('should display error modal when corrupted PDF is selected', () => {
    cy.intercept('POST', '/logError').as('logErrorRequest');

    attachFile({
      encoding,
      filePath: '../../helpers/file/corrupt-pdf.pdf',
      selector: '[data-testid="primary-document-file"]',
    });
    cy.wait('@logErrorRequest');

    cy.get('[data-testid="file-upload-error-modal"]').should('exist');
    cy.get('[data-testid="file-upload-error-modal"]').contains(
      'corrupted or in an unsupported PDF format',
    );
  });

  it('should allow changing selected file', () => {
    attachFile({
      encoding,
      filePath: VALID_FILE,
      selector: '[data-testid="primary-document-file"]',
      selectorToAwaitOnSuccess: '[data-testid="upload-file-success-primary-document-file"]',
    });

    cy.get('[data-testid="change-file-button-primary-document-file"]').click();
    cy.get('[data-testid="primary-document-file"]').should('exist');
  });
});
