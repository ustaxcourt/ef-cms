import { attachFile } from '../../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { getCypressEnv } from '../../../../../helpers/env/cypressEnvironment';
import { goToCase } from '../../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk,
  loginAsPrivatePractitioner,
} from '../../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../helpers/components/typeAhead/select-typeahead-input';

describe('Docket clerk seals / unseals an "Exhibit in Support" (EXS)', () => {
  const primaryFilerName = 'Cody';
  const exhibitTitle = 'Exhibit in Support of Petition';

  // The public site is a separate app served from its own origin, so we must
  // cross into it with cy.origin rather than visiting the logged-in app's root.
  const assertPublicCannotViewExhibit = (docketNumber: string) => {
    const { publicSiteUrl } = getCypressEnv();

    cy.origin(
      publicSiteUrl,
      { args: { docketNumber: docketNumber.trim(), publicSiteUrl } },
      ({ docketNumber: dn, publicSiteUrl: url }) => {
        cy.visit(url);
        cy.get('[data-testid="docket-number"]').type(dn);
        cy.get('[data-testid="docket-search-button"]').click();
        cy.get('[data-testid="header-public-case-detail"]').contains(
          `Docket Number: ${dn}`,
        );

        cy.contains(
          '[data-testid="Filing-and-Proceedings-link-to-docket-entry"]',
          'Exhibit in Support',
        ).should('not.exist');
      },
    );
  };

  it('seals to the public, then to the public and parties, verifying visibility for the clerk, the associated practitioner, and the public at each step', () => {
    loginAsPrivatePractitioner();
    externalUserCreatesElectronicCase(primaryFilerName).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      loginAsPrivatePractitioner();
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();

      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Exhibit in Support',
      );

      cy.get('[data-testid="previous-document-search"]')
        .find('option')
        .then($options => {
          const petitionOption = Array.from($options).find(opt =>
            opt.textContent?.includes('Petition'),
          );
          const optionText = petitionOption?.textContent?.trim() || '';
          cy.get('[data-testid="previous-document-search"]').select(optionText);
        });

      cy.get('[data-testid="submit-document"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get(
        `[data-testid="filingParty-${primaryFilerName}, Petitioner"]`,
      ).click();
      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      loginAsDocketClerk();
      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get('[data-testid="switch-to-section-document-qc-button"]').click();
      cy.get(`[data-testid=work-item-${docketNumber}]`)
        .should('contain', exhibitTitle)
        .find(`[data-testid=work-item-document-link-${docketNumber}]`)
        .click();
      cy.get('[data-testid="save-and-finish-document-qc"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      goToCase(docketNumber);
      cy.get('[data-testid="docket-record-table"]');
      cy.get('[data-testid="document-viewer-link-EXS"]').should(
        'contain',
        exhibitTitle,
      );
      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('[data-testid^="seal-docket-entry-button-"]')
        .should('contain', 'Seal');

      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('[data-testid^="seal-docket-entry-button-"]')
        .click();
      cy.get('[data-testid="seal-docket-entry-modal"]');
      cy.get('#docket-entry-sealed-to-public').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('.sealed-docket-entry')
        .should('exist');
      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('[data-testid^="seal-docket-entry-button-"]')
        .should('contain', 'Unseal');
      cy.get('[data-testid="document-viewer-link-EXS"]').should('exist');

      loginAsPrivatePractitioner();
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('[data-testid="docket-record-table"]');
      cy.get('[data-testid="document-download-link-EXS"]')
        .should('exist')
        .and('contain', exhibitTitle);

      assertPublicCannotViewExhibit(docketNumber);

      loginAsDocketClerk();
      goToCase(docketNumber);
      cy.get('[data-testid="docket-record-table"]');
      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('[data-testid^="seal-docket-entry-button-"]')
        .click();
      cy.get('[data-testid="modal-confirm"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('.sealed-docket-entry')
        .should('not.exist');
      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('[data-testid^="seal-docket-entry-button-"]')
        .should('contain', 'Seal');

      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('[data-testid^="seal-docket-entry-button-"]')
        .click();
      cy.get('[data-testid="seal-docket-entry-modal"]');
      cy.get('#docket-entry-sealed-to-external').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');
      cy.contains('#docket-record-table tr', exhibitTitle)
        .find('.sealed-docket-entry')
        .should('exist');

      loginAsPrivatePractitioner();
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('[data-testid="docket-record-table"]');
      cy.contains('#docket-record-table tr', exhibitTitle).should('exist');
      cy.get('[data-testid="document-download-link-EXS"]').should('not.exist');

      assertPublicCannotViewExhibit(docketNumber);
    });
  });
});
