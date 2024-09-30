import { attachFile } from '../../../../../../helpers/file/upload-file';
import { faker } from '@faker-js/faker';
import { goToCase } from '../../../../../../helpers/caseDetail/go-to-case';
import { loginAsDocketClerk1 } from '../../../../../../helpers/authentication/login-as-helpers';

describe('Docket clerk uploads and edits court-issued docket entries', () => {
  describe('uploads and edits a court-issued docket entry from draft documents view', () => {
    it('should let a docket clerk upload a court-issued docket entry and then edit it while it is unsigned', () => {
      const leadCase = '111-19';

      loginAsDocketClerk1();
      goToCase(leadCase);

      // Arrange: create the docket entry
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-upload-pdf"]').click();
      const title = `${faker.word.adjective()} ${faker.word.noun()}`;
      cy.get('[data-testid="upload-description"]').type(title);
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document-file"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('[data-testid="save-uploaded-pdf-button"]').click();

      // Act: edit the docket entry
      cy.get('[data-testid="tab-drafts"').click();
      cy.get('[data-testid="draft-edit-button-not-signed"]').click();
      const newTitle = `${faker.word.adjective()} ${faker.word.noun()}`;
      cy.get('[data-testid="upload-description"]').clear();
      cy.get('[data-testid="upload-description"]').type(newTitle);
      cy.get('[data-testid="save-edited-pdf-button"]').click();

      // Assert: the new description should display for the edited docket entry
      cy.contains('Draft saved.').should('exist');
      cy.contains(
        '[data-testid^="docket-entry-description-"]',
        newTitle,
      ).should('exist');
    });

    it('should let a docket clerk upload a court-issued docket entry and the edit it after it is signed', () => {
      const leadCase = '111-19';

      loginAsDocketClerk1();
      goToCase(leadCase);

      // Arrange: create the docket entry and sign it
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-upload-pdf"]').click();
      const title = `${faker.word.adjective()} ${faker.word.noun()}`;
      cy.get('[data-testid="upload-description"]').type(title);
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document-file"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('[data-testid="save-uploaded-pdf-button"]').click();
      cy.get('#apply-signature').click();
      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();

      // Act: edit the docket entry
      cy.get('[data-testid="edit-order-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      const newTitle = `${faker.word.adjective()} ${faker.word.noun()}`;
      cy.get('[data-testid="upload-description"]').clear();
      cy.get('[data-testid="upload-description"]').type(newTitle);
      cy.get('[data-testid="save-edited-pdf-button"]').click();

      // Assert: the new description should display for the edited docket entry
      cy.contains('Draft saved.').should('exist');
      cy.contains(
        '[data-testid^="docket-entry-description-"]',
        newTitle,
      ).should('exist');
    });
  });

  describe('uploads and edits a court-issued docket entry from message view', () => {
    it('should let a docket clerk upload a court-issued docket entry and the edit it while it is unsigned', () => {
      const leadCase = '111-19';
      const caseServicesSupervisorId = '35959d1a-0981-40b2-a93d-f65c7977db52';

      loginAsDocketClerk1();
      goToCase(leadCase);

      // Arrange: create the docket entry, sign it, and associate it with a new message
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-upload-pdf"]').click();
      const title = `${faker.word.adjective()} ${faker.word.noun()}`;
      cy.get('[data-testid="upload-description"]').type(title);
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document-file"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('[data-testid="save-uploaded-pdf-button"]').click();

      cy.get('#apply-signature').click();
      cy.get('[data-testid="sign-pdf-canvas"]').click();
      cy.get('[data-testid="save-signature-button"]').click();

      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-add-new-message"]').click();
      cy.get('[data-testid="message-to-section"]').select('docket');
      cy.get('[data-testid="message-to-user-id"]').select(
        caseServicesSupervisorId,
      );
      const messageTitle = `${faker.word.adjective()} ${faker.word.noun()}`;
      cy.get('[data-testid="message-subject"]').type(messageTitle);
      cy.get('[data-testid="message-body"]').type('This is a message.');
      cy.get('[data-testid="select-document"]')
        .contains('option', title)
        .invoke('val')
        .then(value => {
          cy.get('[data-testid="select-document"]').select(value as string);
        });
      cy.get('[data-testid="modal-confirm"]').click();
      cy.get('#tab-case-messages').click();
      cy.contains('a', title).click();

      // Act: edit the docket entry from the messages view
      cy.get('[data-testid="edit-signed-document-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      const newTitle = `${faker.word.adjective()} ${faker.word.noun()}`;
      cy.get('[data-testid="upload-description"]').clear();
      cy.get('[data-testid="upload-description"]').type(newTitle);
      cy.get('[data-testid="save-edited-pdf-button"]').click();

      // Assert: the new description should display for the edited docket entry
      cy.contains('Draft saved.').should('exist');
      cy.contains('.attachment-viewer-button', newTitle).should('exist');
    });

    it('should let a docket clerk upload a court-issued docket entry and the edit it after it is signed', () => {
      const leadCase = '111-19';
      const caseServicesSupervisorId = '35959d1a-0981-40b2-a93d-f65c7977db52';

      loginAsDocketClerk1();
      goToCase(leadCase);

      // Arrange: create the docket entry and associate it with a new message
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-upload-pdf"]').click();
      const title = `${faker.word.adjective()} ${faker.word.noun()}`;
      cy.get('[data-testid="upload-description"]').type(title);
      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: '[data-testid="primary-document-file"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('[data-testid="save-uploaded-pdf-button"]').click();
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-add-new-message"]').click();
      cy.get('[data-testid="message-to-section"]').select('docket');
      cy.get('[data-testid="message-to-user-id"]').select(
        caseServicesSupervisorId,
      );
      const messageTitle = `${faker.word.adjective()} ${faker.word.noun()}`;
      cy.get('[data-testid="message-subject"]').type(messageTitle);
      cy.get('[data-testid="message-body"]').type('This is a message.');
      cy.get('[data-testid="select-document"]')
        .contains('option', title)
        .invoke('val')
        .then(value => {
          cy.get('[data-testid="select-document"]').select(value as string);
        });
      cy.get('[data-testid="modal-confirm"]').click();
      cy.get('#tab-case-messages').click();
      cy.contains('a', title).click();

      // Act: edit the docket entry from the messages view
      cy.get('[data-testid="edit-unsigned-document-button"]').click();
      const newTitle = `${faker.word.adjective()} ${faker.word.noun()}`;
      cy.get('[data-testid="upload-description"]').clear();
      cy.get('[data-testid="upload-description"]').type(newTitle);
      cy.get('[data-testid="save-edited-pdf-button"]').click();

      // Assert: the new description should display for the edited docket entry
      cy.contains('Draft saved.').should('exist');
      cy.contains('.attachment-viewer-button', newTitle).should('exist');
    });
  });
});
