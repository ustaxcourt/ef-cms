import { attachFile } from '../../../../helpers/file/upload-file';
import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { loginAsDocketClerk1 } from '../../../../helpers/authentication/login-as-helpers';

// incremental-catalog.pdf holds its /Catalog at two generations; upload must reject it.
describe('uploading a PDF whose catalog is superseded by an incremental revision', () => {
  const docketNumber = '102-67'; // Any existing docket number works
  const encoding = 'binary'; // This document's whole point is its byte layout

  beforeEach(() => {
    loginAsDocketClerk1();
    goToCase(docketNumber);
    cy.get('[data-testid="case-detail-menu-button"]').click();
    cy.get('[data-testid="menu-button-upload-pdf"]').click();
  });

  it('rejects the file and tells the filer to re-save it', () => {
    cy.intercept('POST', '/logError').as('logErrorRequest');

    attachFile({
      encoding,
      filePath: '../../helpers/file/incremental-catalog.pdf',
      selector: '[data-testid="primary-document-file"]',
    });
    cy.wait('@logErrorRequest');

    cy.get('[data-testid="file-upload-error-modal"]').contains(
      'The file was saved in a format DAWSON cannot process. Open the file in your PDF editor, use Save As to save a new copy, and upload that copy instead.',
    );
    checkA11y();

    cy.get('[data-testid="modal-button-confirm"]').click();
    cy.get('[data-testid^="upload-file-success"]').should('not.exist');
  });

  it('accepts an equivalent document that carries no duplicate', () => {
    attachFile({
      encoding,
      filePath: '../../helpers/file/sample.pdf',
      selector: '[data-testid="primary-document-file"]',
    });

    cy.get('[data-testid^="upload-file-success"]').should('exist');
    cy.get('[data-testid="file-upload-error-modal"]').should('not.exist');
  });
});
