import { attachFile } from '../../../../helpers/file/upload-file';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import {
  loginAsDocketClerk,
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../../helpers/authentication/logout';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';

describe('Document title updates correctly', () => {
  it('should see the document title was updated when they change the event code while QC-ing', () => {
    const primaryFilerName = 'John';
    const additionalInfo = 'This is additional info';
    const docketClerkUserId = '1805d1ab-18d0-43ec-bafb-654e83405416';
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      logout();

      // Private practitioner requests access to case, probably should be an exported function if it is not already
      loginAsPrivatePractitioner();
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('[data-testid="request-represent-a-party-button"]').click();
      selectTypeaheadInput(
        'case-association-document-type-search',
        'Entry of Appearance',
      );
      cy.get(`[data-testid="filer-${primaryFilerName}, Petitioner"]`).click();
      cy.get('[data-testid="auto-generation"]').should('exist');
      cy.get('[data-testid="request-access-submit-document"]').click();
      cy.get('[data-testid="entry-of-appearance-pdf-preview"]').should('exist');
      cy.get('[data-testid="submit-represent-a-party-button"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // Private practitioner adds an exhibit, maybe should have helper to file a document if not already
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput('complete-doc-document-type-search', 'Exhibit(s)');
      cy.get('[data-testid="submit-document"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document"]',
        selectorToAwaitOnSuccess:
          '[data-testid="upload-file-success-primary-document"]',
      });
      cy.get(
        `[data-testid="filingParty-${primaryFilerName}, Petitioner"]`,
      ).click();
      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').click();
      cy.get('[data-testid="loading-overlay"]').should('not.exist');

      // Docket clerk QCs Exhibits docket entry and adds additionalInfo
      loginAsDocketClerk();
      cy.get('[data-testid="document-qc-nav-item"]').click();
      cy.get('[data-testid="switch-to-section-document-qc-button"]').click();

      // Get the row for 115-25 that has the exhibit and complete the qc, sending a message
      cy.contains('a', 'Exhibit(s)').last().click();
      cy.get('[data-testid="additional-info-primary-document-form"]').type(
        additionalInfo,
      );
      cy.get('[data-testid="add-to-coversheet-primary-document-form"]').click({
        force: true,
      });
      cy.get('[data-testid="complete-qc-and-send-message"]').click();
      // sendMessages(
      //   docketClerkUserId,
      //   'Exhibit(s)',
      //   'Docket',
      //   'document-title.cy.ts',
      // );

      // check description?

      // Practitioner files amendment
      //     const documentToSelect = {
      //   category: 'Miscellaneous',
      //   documentTitle: '[First, Second, etc.] Amendment to [anything]',
      //   documentType: 'Amendment [anything]',
      //   eventCode: 'ADMT',
      //   filers: [contactPrimary.contactId],
      //   ordinalValue: 'Other',
      //   otherIteration: '16',
      //   primaryDocumentFile: fakeFile,
      //   scenario: 'Nonstandard F',
      // };
      loginAsPrivatePractitioner();
      cy.visit(`/case-detail/${docketNumber}`);
      cy.get('[data-testid="button-file-document"]').click();
      cy.get('[data-testid="ready-to-file"]').click();
      selectTypeaheadInput(
        'complete-doc-document-type-search',
        'Amendment [anything]',
      );
      selectTypeaheadInput('previous-document-search', 'Exhibit(s)');
      selectTypeaheadInput('ordinal-field-select-search', '1');

      cy.get('[data-testid="submit-document"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document"]',
        selectorToAwaitOnSuccess:
          '[data-testid="upload-file-success-primary-document"]',
      });
      cy.get(
        `[data-testid="filingParty-${primaryFilerName}, Petitioner"]`,
      ).click();
      cy.get('[data-testid="file-document-submit-document"]').click();
      cy.get('[data-testid="redaction-acknowledgement-label"]').click();
      cy.get('[data-testid="file-document-review-submit-document"]').click();
    });
  });
});

// duplicates complete-docket-qc.cy.ts
// function sendMessages(
//   userId: string,
//   subject: string,
//   section: string,
//   messageBody: string = 'Message',
// ) {
//   cy.get('[data-testid="case-detail-menu-button"]').click();
//   cy.get('[data-testid="menu-button-add-new-message"]').click();
//   cy.get('[data-testid="message-to-section"').select(section);
//   cy.get('[data-testid="message-to-user-id"]').select(userId);
//   cy.get('[data-testid="message-subject"]').type(subject);
//   cy.get('[data-testid="message-body"]').type(messageBody);
//   cy.get('[data-testid="modal-confirm"]').click();
//   cy.get('[data-testid="loading-overlay"]').should('not.exist');
//   cy.get('[data-testid="success-alert"]').should('exist');
// }
