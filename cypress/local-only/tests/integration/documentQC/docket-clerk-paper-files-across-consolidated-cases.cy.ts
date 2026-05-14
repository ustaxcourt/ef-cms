import { assertDocketEntryPageCount } from '../../../../helpers/caseDetail/docketRecord/assert-docket-entry-page-count';
import { attachFile } from '../../../../helpers/file/upload-file';
import { createAndServeConsolidatedGroup } from '../../../../helpers/fileAPetition/create-consolidated-case-group';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import { loginAsDocketClerk1 } from '../../../../helpers/authentication/login-as-helpers';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';

/**
 * Paper filing across a consolidated group. A docket clerk creates a paper
 * filing on the lead case (M115 with NCON secondary), saves for later, QCs
 * it (switching the secondary type to "Answer" — same doc-type change as
 * docket-clerk-qcs-paper-filing.cy.ts), then clicks Save and Serve. The
 * confirm modal shows the consolidated-cases checkbox group; selecting
 * "All in the consolidated group" routes the request through
 * editPaperFilingInteractor's multiDocketServeStrategy, which fans the
 * docket entry across every case in the group.
 *
 * Coversheet regression signal: on each case in the group, the resulting
 * docket entry must show numberOfPages = 2 (sample.pdf 1 page + 1
 * coversheet). A regression that drops the coversheet for sibling cases
 * lands at 1; a regression that stacks coversheets lands at 3.
 */
describe('Docket clerk paper-files across consolidated cases', () => {
  it('produces a coversheeted entry on every case in the consolidated group', () => {
    createAndServeConsolidatedGroup({ numberOfMemberCases: 1 }).then(
      ({ leadDocketNumber, memberDocketNumbers }) => {
        const allDocketNumbers = [leadDocketNumber, ...memberDocketNumbers];

        loginAsDocketClerk1();
        goToCase(leadDocketNumber);
        cy.get('[data-testid="case-detail-menu-button"]').click();
        cy.get('[data-testid="menu-button-add-paper-filing"]').click();

        cy.get(
          '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
        ).click();
        cy.get(
          '.usa-date-picker__wrapper > [data-testid="date-received-picker"]',
        ).type('01/01/2018');

        selectTypeaheadInput('primary-document-type-search', 'M115');
        selectTypeaheadInput('secondary-document-type-search', 'NCON');

        cy.get('[data-testid="filed-by-option"]').contains('Petitioner').click();
        cy.get('[data-testid="objections-No"]').click();

        cy.get('[data-testid="upload-pdf-button"]').click();
        attachFile({
          filePath: '../../helpers/file/sample.pdf',
          selector: 'input#primaryDocumentFile-file',
          selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
        });

        cy.get('[data-testid="save-for-later"]').click();
        cy.get('[data-testid="success-alert"]').contains(
          'Your entry has been added to the docket record.',
        );

        // Open the work item from My Document QC and change the secondary
        // doc type — exercising the QC edit path that drives coversheet
        // regen and NODC for paper filings.
        cy.get('[data-testid="document-qc-nav-item"]').click();
        cy.get(
          '[data-testid="individual-work-queue-in-progress-button"]',
        ).click();
        cy.get(
          `[data-testid="${leadDocketNumber}-qc-item-row"] [data-testid="qc-link"]`,
        ).click();
        selectTypeaheadInput('secondary-document-type-search', 'Answer');
        cy.get('[data-testid="save-and-serve"]').click();

        // The confirm-serve modal includes the consolidated checkboxes for
        // multi-docket filings. Select "All in the consolidated group" so
        // the entry fans across every case.
        cy.get('[data-testid="confirm-initiate-service-modal"]').should(
          'exist',
        );
        cy.get('[data-testid="consolidated-case-checkbox-all"]').check({
          force: true,
        });
        cy.get('[data-testid="modal-button-confirm"]').click();
        cy.get('[data-testid="loading-overlay"]').should('not.exist');

        // Each case in the group should now show the M115 entry at
        // numberOfPages = 2.
        for (const docketNumber of allDocketNumbers) {
          goToCase(docketNumber);
          assertDocketEntryPageCount({ eventCode: 'M115', expected: '2' });
        }
      },
    );
  });
});
