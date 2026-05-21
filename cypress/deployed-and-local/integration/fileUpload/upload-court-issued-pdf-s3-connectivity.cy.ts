import { attachFile } from '../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { externalUserSearchesDocketNumber } from '../../../helpers/advancedSearch/external-user-searches-docket-number';
import { petitionsClerkServesPetition } from '../../../helpers/documentQC/petitionsclerk-serves-petition';
import { loginAsPetitioner } from '../../../helpers/authentication/login-as-helpers';
import { selectTypeaheadInput } from '../../../helpers/components/typeAhead/select-typeahead-input';

/**
 * This test verifies that the S3 file upload path is fully functional end-to-end
 * via the file-a-document route used by external parties (petitioners/practitioners).
 *
 * It runs on deployed environments as part of deployment gates; if S3 is
 * misconfigured (e.g. broken CORS policy, bucket permissions, network routing)
 * this test will fail and block the deployment.
 *
 * The S3 upload occurs on final form submission in FileDocumentReview —
 * the app fetches a presigned upload policy from the API then POSTs the file
 * directly to S3.
 *
 * Note: "Answer" does not require an objections field (only Motions do),
 * so the flow goes directly from file upload to the review page.
 */
describe('S3 file upload connectivity - file-a-document', () => {
  it('should successfully upload a file to S3 via the file-a-document path', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      loginAsPetitioner();
      externalUserSearchesDocketNumber(docketNumber);
    });

    // SelectDocumentType tab
    cy.get('[data-testid="button-file-document"]').click();
    cy.get('[data-testid="ready-to-file"]').click();
    selectTypeaheadInput('complete-doc-document-type-search', 'Answer');
    cy.get('[data-testid="submit-document"]').click();

    // FileDocument tab — Answer has no objections field, submit goes straight to review
    attachFile({
      filePath: '../../helpers/file/sample.pdf',
      selector: '[data-testid="primary-document"]',
      selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
    });
    cy.get('#submit-document').click();

    // FileDocumentReview tab — final submit triggers the S3 presigned POST upload
    cy.get('[data-testid="redaction-acknowledgement-label"]').click();
    cy.get('#submit-document').click();

    // Success: the filed Answer appears on the docket record
    cy.get('[data-testid="document-download-link-A"]', {
      timeout: 30000,
    }).should('exist');
  });
});
