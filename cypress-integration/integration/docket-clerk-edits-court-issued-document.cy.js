import { uploadCourtIssuedDocumentAndEditViaDocumentQC } from '../support/pages/document-qc';

describe('Docket clerk edits a court issued document', function () {
  before(() => {
    cy.login('docketclerk');
  });

  it('upload a court issued document, click on the in progress link, and navigate to the correct page', () => {
    const attempt = cy.state('runnable')._currentRetry;
    uploadCourtIssuedDocumentAndEditViaDocumentQC(attempt);
  });
});
