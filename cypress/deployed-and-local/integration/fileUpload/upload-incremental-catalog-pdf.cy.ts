import { attachFile } from '../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { faker } from '@faker-js/faker';
import { goToCase } from '../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../../helpers/authentication/login-as-helpers';

/**
 * Uploads a structurally valid PDF that carries the precondition for the
 * cross-reference defect, and reports the storage key it was written under so
 * the stored bytes can be fetched from S3 and examined.
 *
 * `incremental-catalog.pdf` is an incrementally updated document whose
 * `/Catalog` exists at two generations - what an Acrobat "Save" produces. It is
 * legal, and `qpdf --check` reports no errors on it. pdf-lib's parser scans the
 * whole file rather than following the cross-reference table, so it registers
 * both copies, and its writer emits both rows under one object number - leaving
 * a document Adobe refuses to open. Regenerate the fixture with
 * `./scripts/pdf/pdf-fixture.ts`.
 *
 * The binary encoding matters more here than in most upload specs: without it
 * Cypress does not hand the browser the exact bytes, and this document's whole
 * point is its byte layout.
 *
 * On `cy.intercept`: CYPRESS-README asks that it be avoided, because it couples
 * a test to an API detail. It is used deliberately here. The storage key is
 * never rendered, and it is the one thing this spec exists to report; the
 * alternative is a database lookup outside the test, which would leave the
 * spec unable to state its own result.
 */
describe('uploading a PDF whose catalog is superseded by an incremental revision', () => {
  const FIXTURE = '../../helpers/file/incremental-catalog.pdf';
  const KEY_REPORT = 'cypress/downloads/incremental-catalog-storage-key.txt';

  it('accepts the upload, and reports the storage key it was saved under', () => {
    const description = `xref fixture ${faker.word.adjective()} ${faker.word.noun()}`;

    // Opening the draft asks the API for a download URL, and the storage key
    // is a path segment of that request.
    cy.intercept('GET', '**/case-documents/*/*/document-download-url').as(
      'documentDownloadUrl',
    );

    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      loginAsDocketClerk1();
      goToCase(docketNumber);

      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-upload-pdf"]').click();
      cy.get('[data-testid="upload-description"]').type(description);

      attachFile({
        encoding: 'binary',
        filePath: FIXTURE,
        selector: '[data-testid="primary-document-file"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });

      // The document is valid, so the pipeline must accept it. A rejection here
      // would mean the fixture is wrong, not that the defect is absent.
      cy.get('[data-testid="file-upload-error-modal"]').should('not.exist');
      cy.get('[data-testid="save-uploaded-pdf-button"]').click();

      cy.get('[data-testid="tab-drafts"]').click();
      cy.contains('[data-testid^="docket-entry-description-"]', description)
        .should('exist')
        .click();

      cy.wait('@documentDownloadUrl').then(({ request }) => {
        const key =
          /case-documents\/[^/]+\/([^/]+)\/document-download-url/.exec(
            request.url,
          )![1];

        cy.writeFile(KEY_REPORT, `${docketNumber} ${key}\n`);
        cy.log(`docket ${docketNumber}, stored under key: ${key}`);

        expect(key, 'the storage key should be a uuid').to.match(
          /^[0-9a-f-]{36}$/,
        );
      });
    });
  });
});
