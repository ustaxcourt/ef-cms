import { attachFile } from 'cypress/helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../../../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../../../../helpers/authentication/logout';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';

/**
 * Full docket-clerk paper-filing journey for story 10192: the clerk creates a
 * paper filing whose Document Type is "Exhibit in Support" (EXS), associates it
 * with a docketed filing, adds Attachments + Certificate of Service, and Saves
 * and Serves. Mirrors the TestRail manual case.
 *
 * The seeded case has an electronic petitioner (no paper-service parties), so
 * the "Print for Paper Service Receipt" branch does not apply here.
 */
describe('Docket clerk paper-files an Exhibit in Support (EXS)', () => {
  it('should serve the paper filing and title it "Exhibit in Support of [Document Name]" with Attachments and Certificate of Service', () => {
    const today = formatNow(FORMATS.MMDDYYYY);

    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      logout();

      // Step 1-3: docket clerk opens the case and starts a paper filing.
      loginAsDocketClerk1();
      goToCase(docketNumber);
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-add-paper-filing"]').click();

      // Step 4: fill out the paper filing form.
      selectTypeaheadInput(
        'primary-document-type-search',
        'Exhibit in Support',
      );

      cy.get(
        '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
      ).type(today);

      // "Which document is this exhibit in support of?" — associate with the
      // served Petition.
      cy.contains('Which document is this exhibit in support of?').should(
        'exist',
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

      // Attachments + Certificate of Service (today's date).
      cy.get('#attachments').check({ force: true });
      cy.get('[data-testid="certificate-of-service-label"]').click();
      cy.get(
        '.usa-date-picker__wrapper > [data-testid="service-date-picker"]',
      ).type(today);

      // Check who you are filing for.
      cy.get('[data-testid="filed-by-option"]').contains('Petitioner').click();

      // Upload the document.
      cy.get('[data-testid="upload-pdf-button"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: 'input#primaryDocumentFile-file',
        selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
      });

      // Save and Serve — confirm the generated title in the modal.
      cy.get('[data-testid="save-and-serve"]').click();
      cy.get('[data-testid="confirm-modal-document-title"]').contains(
        'Exhibit in Support of Petition',
      );
      cy.get('[data-testid="modal-button-confirm"]').click();

      // Routed to the Docket Record with the served-document success banner.
      // (The served-document banner text is set asynchronously via the serve
      // completion handler, so assert the banner is present rather than an
      // exact string.)
      cy.get('[data-testid="success-alert"]').should('exist');

      // Step 5: verify the docket record entry.
      // Page count: 1-page sample.pdf + generated coversheet = 2.
      cy.contains('[data-testid^="docket-entry-eventCode-"]', 'EXS')
        .parents('tr')
        .find('.number-of-pages')
        .should('have.text', '2');

      // Title follows "Exhibit in Support of [Document Name]" under EXS.
      cy.get('[data-testid="document-viewer-link-EXS"]').contains(
        'Exhibit in Support of Petition',
      );

      // Attachments + Certificate of Service display on the row.
      cy.contains('#docket-record-table tr', 'Exhibit in Support of Petition')
        .should('contain', '(Attachment(s))')
        .and('contain', '(C/S');

      // Exhibit in Support docs display when filtered to show "Exhibits".
      cy.get('#document-filter-by').select('Exhibits');
      cy.get('[data-testid="document-viewer-link-EXS"]').should('exist');
    });
  });
});
