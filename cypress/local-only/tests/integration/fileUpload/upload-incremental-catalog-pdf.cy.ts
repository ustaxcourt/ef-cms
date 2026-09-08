import { attachFile } from '../../../../helpers/file/upload-file';
import { checkA11y } from '../../../support/generalCommands/checkA11y';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../../../helpers/authentication/login-as-helpers';

/**
 * `incremental-catalog.pdf` is an incrementally updated document whose
 * `/Catalog` exists at two generations - what an Acrobat "Save" produces. It is
 * legal, and `qpdf --check` reports no errors on it. pdf-lib's parser scans the
 * whole file rather than following the cross-reference table, so it registers
 * both copies, and its writer emits both rows under one object number - leaving
 * a document Adobe refuses to open. Regenerate the fixture with
 * `./scripts/pdf/pdf-fixture.ts`.
 *
 * Validation now rejects such a file before it is uploaded, and the modal tells
 * the filer to re-save it, which clears the duplicate. This spec asserts that
 * rejection; it previously asserted the upload succeeded, which is what let the
 * damaged document reach S3.
 *
 * The binary encoding matters more here than in most upload specs: without it
 * Cypress does not hand the browser the exact bytes, and this document's whole
 * point is its byte layout.
 */
describe('uploading a PDF whose catalog is superseded by an incremental revision', () => {
  const FIXTURE = '../../helpers/file/incremental-catalog.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    return externalUserCreatesElectronicCase().then(docketNumber => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-upload-pdf"]').click();
    });
  });

  it('rejects the file and tells the filer to re-save it', () => {
    attachFile({
      encoding: 'binary',
      filePath: FIXTURE,
      selector: '[data-testid="primary-document-file"]',
    });

    cy.get('[data-testid="file-upload-error-modal"]').contains(
      'The file was saved in a format DAWSON cannot process. Open the file in your PDF editor, use Save As to save a new copy, and upload that copy instead.',
    );
    checkA11y();

    cy.get('[data-testid="modal-button-confirm"]').click();
    cy.get('[data-testid="primary-document-file"]').should('exist');
  });

  it('accepts an equivalent document that carries no duplicate', () => {
    attachFile({
      encoding: 'binary',
      filePath: '../../helpers/file/sample.pdf',
      selector: '[data-testid="primary-document-file"]',
      selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
    });

    cy.get('[data-testid="file-upload-error-modal"]').should('not.exist');
  });
});
