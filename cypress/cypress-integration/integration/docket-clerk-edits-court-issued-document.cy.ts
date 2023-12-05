import { navigateTo as navigateToDashboard } from '../support/pages/dashboard';
import { uploadCourtIssuedDocumentAndEditViaDocumentQC } from '../support/pages/document-qc';

describe('Docket clerk edits a court issued document', function () {
  it('upload a court issued document, click on the in progress link, and navigate to the correct page', () => {
    navigateToDashboard('docketclerk');
    uploadCourtIssuedDocumentAndEditViaDocumentQC();
  });
});
