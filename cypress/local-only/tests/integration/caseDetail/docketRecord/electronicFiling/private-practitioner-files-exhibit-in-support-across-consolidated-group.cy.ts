import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { addCaseToGroup } from '../../../../../../helpers/caseDetail/add-case-to-group';
import { assertDocketEntryPageCount } from '../../../../../../helpers/caseDetail/docketRecord/assert-docket-entry-page-count';
import { attachFile } from '../../../../../../helpers/file/upload-file';
import { createAndServePaperPetition } from '../../../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { externalUserSearchesDocketNumber } from '../../../../../../helpers/advancedSearch/external-user-searches-docket-number';
import { goToCase } from '../../../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsPrivatePractitioner,
} from '../../../../../../helpers/authentication/login-as-helpers';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';
import { updateCaseStatus } from '../../../../../../helpers/caseDetail/caseInformation/update-case-status';

/**
 * Story 10192 ("Verify that you can file across a Consolidated Group") — a
 * private practitioner who represents the petitioner on every case in a
 * consolidated group can file a Motion with an "Exhibit in Support" (EXS)
 * once, scoped to "All in the consolidated group", and have it land on
 * every case's Docket Record.
 *
 * Representation is per-case (there's no existing spec, for any role, where
 * group membership alone grants filing access — the IRS/DOJ consolidated
 * filing specs associate the practitioner with every member case first), so
 * this test requests access on both the lead and member case before filing.
 */
describe('Private practitioner files an Exhibit in Support across a consolidated group', () => {
  it('should land the Exhibit in Support on every case in the group', () => {
    createAndServePaperPetition({ name: 'Group Lead Petitioner' }).then(
      ({ docketNumber: leadDocketNumber, name: leadName }) => {
        loginAsDocketClerk1();
        goToCase(leadDocketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);

        createAndServePaperPetition({ name: 'Group Member Petitioner' }).then(
          ({ docketNumber: memberDocketNumber, name: memberName }) => {
            loginAsDocketClerk1();
            goToCase(memberDocketNumber);
            updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
            addCaseToGroup(leadDocketNumber);

            // The practitioner must represent the petitioner on each case
            // individually before filing across the group.
            [
              { docketNumber: leadDocketNumber, name: leadName },
              { docketNumber: memberDocketNumber, name: memberName },
            ].forEach(({ docketNumber, name }) => {
              loginAsPrivatePractitioner();
              externalUserSearchesDocketNumber(docketNumber);
              cy.get(
                '[data-testid="request-represent-a-party-button"]',
              ).click();
              selectTypeaheadInput(
                'case-association-document-type-search',
                'Entry of Appearance',
              );
              cy.get(`[data-testid="filer-${name}, Petitioner"]`).click();
              cy.get('[data-testid="auto-generation"]').should('exist');
              cy.get('[data-testid="request-access-submit-document"]').click();
              cy.get('[data-testid="entry-of-appearance-pdf-preview"]').should(
                'exist',
              );
              cy.get('[data-testid="submit-represent-a-party-button"]').click();
              cy.get('[data-testid="document-download-link-EA"]').should(
                'exist',
              );
            });

            // File the Motion + Exhibit in Support from the lead case,
            // scoped to the whole consolidated group.
            loginAsPrivatePractitioner();
            externalUserSearchesDocketNumber(leadDocketNumber);
            cy.get('[data-testid="button-file-document"]').click();
            cy.get('[data-testid="ready-to-file"]').click();
            selectTypeaheadInput(
              'complete-doc-document-type-search',
              'Motion for Continuance',
            );
            cy.get('[data-testid="submit-document"]').click();
            attachFile({
              filePath: '../../helpers/file/sample.pdf',
              selector: '[data-testid="primary-document"]',
              selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
            });
            cy.get('[data-testid="primaryDocument-objections-No"]').click();

            cy.get('#add-supporting-document-button').click();
            cy.get('#supporting-document-0').select('Exhibit');
            attachFile({
              filePath: '../../helpers/file/sample.pdf',
              selector: '[data-testid="supporting-document-file-0"]',
              selectorToAwaitOnSuccess:
                '[data-testid="upload-file-success-supporting-document-file-0"]',
            });
            cy.get('label[for="supportingDocuments-0-attachments"]').click();

            cy.get('#consolidated-group-all').check({ force: true });
            cy.get(
              `[data-testid="filingParty-${leadName}, Petitioner"]`,
            ).click();

            cy.get('[data-testid="file-document-submit-document"]').click();
            cy.get('[data-testid="redaction-acknowledgement-label"]').click();
            cy.get(
              '[data-testid="file-document-review-submit-document"]',
            ).click();
            cy.get('[data-testid="loading-overlay"]').should('not.exist');
            cy.get('[data-testid="success-alert"]').should('exist');

            // The Exhibit in Support shows up on the Docket Record of both
            // the lead case and the member case, coversheet included.
            [leadDocketNumber, memberDocketNumber].forEach(docketNumber => {
              cy.visit(`/case-detail/${docketNumber}`);
              cy.get('[data-testid="docket-record-table"]').should('exist');
              cy.get('[data-testid="document-download-link-EXS"]').should(
                'contain',
                'Exhibit in Support of Motion for Continuance',
              );
              assertDocketEntryPageCount({ eventCode: 'EXS', expected: '2' });
            });
          },
        );
      },
    );
  });
});
