import {
  loginAsDocketClerk,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';

describe('Edit Docket Entry - Notice of Receipt of Petition', () => {
  it('should allow editing the notice of receipt of petition', () => {
    loginAsPrivatePractitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      loginAsDocketClerk();
      goToCase(docketNumber);
      cy.get('[data-testid="edit-NOTR"]').click();
      cy.get(
        '[data-testid="edit-docket-entry-meta-document-type-search"]',
      ).contains('Notice of Receipt of Petition');
      cy.get(
        '[data-testid="edit-docket-entry-meta-docket-entry-preview"]',
      ).contains('Docket Entry preview: Notice of Receipt of Petition');
      cy.get('#additional-info').type('add info');
      cy.get('[data-testid="save-edit-docket-entry-meta"]').click();
      cy.get('[data-testid="document-viewer-link-NOTR"]').contains(
        'Notice of Receipt of Petition add info',
      );
    });
  });
});
