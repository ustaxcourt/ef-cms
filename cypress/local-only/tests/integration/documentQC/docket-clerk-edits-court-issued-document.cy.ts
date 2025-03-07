import { loginAsDocketClerk } from 'cypress/helpers/authentication/login-as-helpers';
import { uploadCourtIssuedDocumentAndEditViaDocumentQC } from '../../../support/pages/document-qc';

describe('Docket clerk edits a court issued document', function () {
  it('upload a court issued document, click on the in progress link, and navigate to the correct page', () => {
    loginAsDocketClerk();
    uploadCourtIssuedDocumentAndEditViaDocumentQC();
  });
});
