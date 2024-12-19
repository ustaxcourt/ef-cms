import { attachFile } from '../../../../../../helpers/file/upload-file';
import { createAndServePaperFiling } from '../../../../../../helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { createAndServePaperPetition } from '../../../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import {
  createMessage,
  enterSubject,
  fillOutMessageField,
  selectRecipient,
  selectSection,
  sendMessage,
} from '../../../../../support/pages/document-qc';
import { goToCase } from '../../../../../../helpers/caseDetail/go-to-case';
import {
  loginAsClerkOfCourt,
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../../../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCaseWithSpouse } from '../../../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { selectTypeaheadInput } from '../../../../../../helpers/components/typeAhead/select-typeahead-input';

describe('Judge`s chambers stamps an order', () => {
  it('should create an order, serve it, apply a stamp to it, then redirect to Drafts of case detail', () => {
    loginAsPetitioner();
    petitionerCreatesElectronicCaseWithSpouse().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      cy.login('docketclerk1', `case-detail/${docketNumber}`);

      // File Motion for Continuance
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-add-paper-filing"]').click();
      cy.get('input#date-received-picker').type('11/01/2023');
      selectTypeaheadInput(
        'primary-document-type-search',
        'Motion for Continuance',
      );
      cy.get('[data-testid="filed-by-option"]').contains('Petitioner').click();
      cy.get('[data-testid="upload-pdf-button"]').click();
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: 'input#primaryDocumentFile-file',
        selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
      });
      cy.get('[data-testid="save-and-serve"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('.usa-alert').should(
        'contain',
        'Print and mail to complete paper service.',
      );

      // Apply a stamp
      loginAsClerkOfCourt();
      goToCase(docketNumber);
      cy.get('[data-testid="document-viewer-link-M006"]').last().click();
      cy.get('[data-testid="apply-stamp"]').click();
      cy.get('[data-testid="status-report-or-stip-decision-due-date"]').click();
      cy.get('input#due-date-input-statusReportDueDate-picker').type(
        '11/02/2023',
      );
      cy.get('input#due-date-input-statusReportDueDate-picker').should(
        'have.value',
        '11/02/2023',
      );
      cy.get('[data-testid="clear-optional-fields"]').click();
      cy.get('[data-testid="status-report-or-stip-decision-due-date"]').click();
      cy.get('input#due-date-input-statusReportDueDate-picker').should(
        'have.value',
        '',
      );

      // Apply stamp
      cy.get('[data-testid="clear-optional-fields"]').click();
      cy.get('[data-testid="motion-disposition-Granted"]').click();
      cy.get('[data-testid="save-signature-button"]').click();

      // Make sure it's there
      cy.get('[data-testid="success-alert"]').contains(
        'Motion for Continuance stamped successfully.',
      );
      cy.get('[data-testid="docket-entry-description-1"]').contains(
        'Motion for Continuance GRANTED',
      );
    });
  });

  it('should allow judge to stamp motion from Message View and redirect to MessageDetail', () => {
    createAndServePaperPetition().then(({ docketNumber }) => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      createAndServePaperFiling({
        dateReceived: '01/01/2022',
        documentType: 'Motion to Proceed Remotely',
      });
      cy.get(
        '[data-testid="docket-record-table"] td:contains("Motion to Proceed Remotely")',
      )
        .parent()
        .invoke('attr', 'data-testid')
        .then(docketEntryId => {
          createMessage();
          selectSection('Clerk of the Court');
          selectRecipient('Test Clerk of Court');
          enterSubject();
          fillOutMessageField();
          cy.get('[data-testid="select-document"]').select(docketEntryId!);
          sendMessage();
          loginAsClerkOfCourt();
          cy.get(
            '.message-subject > .message-document-title > [data-testid="messages-individual-inbox-subject-cell"]',
          )
            .first()
            .click();
          cy.get('[data-testid="apply-stamp"]').click();
          cy.get('[data-testid="motion-disposition-Granted"]').click();
          cy.get('[data-testid="save-signature-button"]').click();
          cy.get('[data-testid="success-alert"]').contains(
            'Motion to Proceed Remotely stamped successfully.',
          );
          cy.get('.attachment-viewer-button')
            .contains('Motion to Proceed Remotely')
            .should('be.visible');
          cy.get('.attachment-viewer-button')
            .contains('Motion to Proceed Remotely GRANTED')
            .should('be.visible');
        });
    });
  });
});
