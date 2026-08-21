import { attachFile } from '../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { loginAsDocketClerk1, loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';

describe('StateDrivenFileInput', () => {
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

  it('should use FileInput internally', () => {
    cy.get('[data-testid="primary-document-file"]').should('exist');
    cy.get('[data-testid="primary-document-file"]').should(
      'have.attr',
      'accept',
      '.pdf',
    );
  });

  it('should handle file upload through Cerebral sequences', () => {
    attachFile({
      encoding,
      filePath: VALID_FILE,
      selector: '[data-testid="primary-document-file"]',
      selectorToAwaitOnSuccess: '[data-testid="upload-file-success-primary-document-file"]',
    });
  });

  it('should display error modal on invalid file through Cerebral error handler', () => {
    cy.intercept('POST', '/logError').as('logErrorRequest');

    attachFile({
      encoding,
      filePath: '../../helpers/file/non-pdf.txt',
      selector: '[data-testid="primary-document-file"]',
    });
    cy.wait('@logErrorRequest');

    cy.get('[data-testid="file-upload-error-modal"]').should('exist');
    cy.get('[data-testid="modal-button-confirm"]').click();
  });

  it('should update form state when file is selected', () => {
    attachFile({
      encoding,
      filePath: VALID_FILE,
      selector: '[data-testid="primary-document-file"]',
      selectorToAwaitOnSuccess: '[data-testid="upload-file-success-primary-document-file"]',
    });
  });

  it('should allow changing file and updating form state', () => {
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
