import { attachFile } from '../../../helpers/file/upload-file';
import { createAndServePaperPetition } from '../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { goToCase } from '../../../helpers/caseDetail/go-to-case';
import { loginAsDocketClerk1 } from '../../../helpers/authentication/login-as-helpers';

/**
 * This test verifies that the S3 upload path is fully functional end-to-end.
 * It runs on deployed environments as part of deployment gates; if S3 is
 * misconfigured (e.g. broken CORS policy, bucket permissions, network routing)
 * this test will fail and block the deployment.
 */
describe('S3 upload connectivity', () => {
  it('should successfully upload a PDF to S3 when uploading a court-issued document', () => {
    const encoding = 'binary';

    createAndServePaperPetition().then(({ docketNumber }) => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-upload-pdf"]').click();

      attachFile({
        encoding,
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document-file"]',
      });

      cy.get('[data-testid^="upload-file-success"]').should('exist');
    });
  });
});
