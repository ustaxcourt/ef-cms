import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { getCypressEnv } from '../../../../helpers/env/cypressEnvironment';

describe('Public Docket Record', () => {
  it('should allow the user to generate and download a PDF of the docket record', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      cy.get('[data-testid="account-menu-button"]').click();
      cy.get('[data-testid="logout-button-desktop"]').click();

      const publicSiteUrl = getCypressEnv().publicSiteUrl;
      cy.origin(
        publicSiteUrl,
        { args: { docketNumber, publicSiteUrl } },
        ({ docketNumber: dn, publicSiteUrl: url }) => {
          cy.visit(url);
          cy.get('input#docket-number').type(dn);
          cy.get('button#docket-search-button').click();
          cy.get('[data-testid="header-public-case-detail"]').contains(
            `Docket Number: ${dn}`,
          );
          cy.get('[data-testid="print-public-docket-record-button"]').click();
          cy.get('[data-testid="modal-header"]');
        },
      );
    });
  });
});
