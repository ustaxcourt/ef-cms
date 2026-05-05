import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import {
  createMessage,
  enterSubject,
  fillOutMessageField,
  goToDocumentNeedingQC,
  openCompleteAndSendMessageDialog,
  progressIndicatorDoesNotExist,
  selectRecipient,
  selectSection,
  sendMessage,
} from '../../../support/pages/document-qc';
import {
  getCaseStatusFilter,
  messagesShouldBeFiltered,
  selectsCaseStatusFilterNew,
} from '../../../support/pages/dashboard';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsAdc,
  loginAsAdmissionsClerk,
  loginAsColvin,
  loginAsColvinChambers,
  loginAsDocketClerk,
  loginAsGeneral,
  loginAsPetitionsClerk,
  loginAsReportersOffice,
  loginAsTrialClerk,
} from '../../../../helpers/authentication/login-as-helpers';

describe('Messages', () => {
  describe('Message filtering', () => {
    describe('Docket clerk completes qc and sends a message', () => {
      it('should go to section document QC inbox, complete an item needing qc, and send a message', () => {
        loginAsDocketClerk();
        cy.visit('/document-qc/section/inbox');
        cy.get('.big-blue-header').should('exist');
        goToDocumentNeedingQC();
        openCompleteAndSendMessageDialog();
        selectSection('ADC');
        selectRecipient('Test ADC');
        fillOutMessageField();
        sendMessage();
        progressIndicatorDoesNotExist();
      });
    });

    describe('Docket clerk creates and sends a message on a "Calendared" case', () => {
      it('should go to case detail and open the dialog to create a new message', () => {
        loginAsDocketClerk();
        cy.visit('/case-detail/103-20');
        createMessage();
        selectSection('ADC');
        selectRecipient('Test ADC');
        enterSubject();
        fillOutMessageField();
        sendMessage();
        progressIndicatorDoesNotExist();
      });
    });

    describe('Docket clerk creates and sends a message on a "New" case', () => {
      it('should go to case detail and open the dialog to create a new message', () => {
        loginAsDocketClerk();
        cy.visit('/case-detail/102-20');
        createMessage();
        selectSection('ADC');
        selectRecipient('Test ADC');
        enterSubject();
        fillOutMessageField();
        sendMessage();
        progressIndicatorDoesNotExist();
      });
    });

    describe('ADC views messages', () => {
      it('should be able to filter messages', () => {
        loginAsAdc();
        getCaseStatusFilter();
        selectsCaseStatusFilterNew();
        messagesShouldBeFiltered();
      });
    });
  });

  const DOCKET_CLERK_ID = '1805d1ab-18d0-43ec-bafb-654e83405416';

  describe('Message sorting', () => {
    const createMessageSortingFixture = (): Cypress.Chainable<string> => {
      return createAndServePaperPetition().then(({ docketNumber }) => {
        goToCase(docketNumber);
        sendMessagesToCompletedTab(DOCKET_CLERK_ID);
        loginAsPetitionsClerk();
        goToCase(docketNumber);
        sendMessages(DOCKET_CLERK_ID);

        return cy.wrap(docketNumber);
      });
    };

    const openMessagesInboxAsDocketClerk = (): void => {
      loginAsDocketClerk();
      cy.visit('/messages/my/inbox');
    };

    const openMessagesInboxAsPetitionsClerk = (): void => {
      loginAsPetitionsClerk();
      cy.visit('/messages/my/inbox');
    };

    const openSectionMessages = (): void => {
      cy.get('[data-testid="switch-to-section-messages-button"]').click();
    };

    it('should sort the individual inbox and completed message tables for a fresh case', () => {
      createMessageSortingFixture().then(docketNumber => {
        openMessagesInboxAsDocketClerk();

        cy.get(
          '[data-testid="messages-individual-inbox-subject-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'inbox',
          docketNumber,
          isAscending: true,
          prefix: 'Subject Line',
          queueType: 'individual',
        });
        cy.get(
          '[data-testid="messages-individual-inbox-subject-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'inbox',
          docketNumber,
          isAscending: false,
          prefix: 'Subject Line',
          queueType: 'individual',
        });

        openMessagesInboxAsDocketClerk();

        cy.get(
          '[data-testid="messages-individual-inbox-createdAt-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'inbox',
          docketNumber,
          isAscending: false,
          prefix: 'Subject Line',
          queueType: 'individual',
        });
        cy.get(
          '[data-testid="messages-individual-inbox-createdAt-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'inbox',
          docketNumber,
          isAscending: true,
          prefix: 'Subject Line',
          queueType: 'individual',
        });

        cy.get('[data-testid="messages-completed-tab"]').click();
        cy.get(
          '[data-testid="messages-individual-completed-subject-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'completed',
          docketNumber,
          isAscending: true,
          prefix: 'Complete',
          queueType: 'individual',
        });
        cy.get(
          '[data-testid="messages-individual-completed-subject-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'completed',
          docketNumber,
          isAscending: false,
          prefix: 'Complete',
          queueType: 'individual',
        });

        cy.get(
          '[data-testid="messages-individual-completed-completedAt-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'completed',
          docketNumber,
          isAscending: true,
          prefix: 'Complete',
          queueType: 'individual',
        });
        cy.get(
          '[data-testid="messages-individual-completed-completedAt-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'completed',
          docketNumber,
          isAscending: false,
          prefix: 'Complete',
          queueType: 'individual',
        });
      });
    });

    it('should sort the individual outbox table for a fresh case', () => {
      createMessageSortingFixture().then(docketNumber => {
        openMessagesInboxAsPetitionsClerk();
        cy.get('[data-testid="messages-outbox-tab"]').click();

        cy.get(
          '[data-testid="messages-individual-outbox-subject-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'outbox',
          docketNumber,
          isAscending: true,
          prefix: 'Subject Line',
          queueType: 'individual',
        });
        cy.get(
          '[data-testid="messages-individual-outbox-subject-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'outbox',
          docketNumber,
          isAscending: false,
          prefix: 'Subject Line',
          queueType: 'individual',
        });

        cy.get(
          '[data-testid="messages-individual-outbox-createdAt-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'outbox',
          docketNumber,
          isAscending: true,
          prefix: 'Subject Line',
          queueType: 'individual',
        });
        cy.get(
          '[data-testid="messages-individual-outbox-createdAt-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'outbox',
          docketNumber,
          isAscending: false,
          prefix: 'Subject Line',
          queueType: 'individual',
        });
      });
    });

    it('should sort the section inbox and completed message tables for a fresh case', () => {
      createMessageSortingFixture().then(docketNumber => {
        openMessagesInboxAsDocketClerk();
        openSectionMessages();

        cy.get(
          '[data-testid="messages-section-inbox-subject-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'inbox',
          docketNumber,
          isAscending: true,
          prefix: 'Subject Line',
        });
        cy.get(
          '[data-testid="messages-section-inbox-subject-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'inbox',
          docketNumber,
          isAscending: false,
          prefix: 'Subject Line',
        });

        openMessagesInboxAsDocketClerk();
        openSectionMessages();

        cy.get(
          '[data-testid="messages-section-inbox-createdAt-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'inbox',
          docketNumber,
          isAscending: false,
          prefix: 'Subject Line',
        });
        cy.get(
          '[data-testid="messages-section-inbox-createdAt-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'inbox',
          docketNumber,
          isAscending: true,
          prefix: 'Subject Line',
        });

        cy.get('[data-testid="messages-completed-tab"]').click();
        cy.get(
          '[data-testid="messages-section-completed-subject-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'completed',
          docketNumber,
          isAscending: true,
          prefix: 'Complete',
        });
        cy.get(
          '[data-testid="messages-section-completed-subject-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'completed',
          docketNumber,
          isAscending: false,
          prefix: 'Complete',
        });

        cy.get(
          '[data-testid="messages-section-completed-completedAt-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'completed',
          docketNumber,
          isAscending: true,
          prefix: 'Complete',
        });
        cy.get(
          '[data-testid="messages-section-completed-completedAt-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'completed',
          docketNumber,
          isAscending: false,
          prefix: 'Complete',
        });
      });
    });

    it('should sort the section outbox table for a fresh case', () => {
      createMessageSortingFixture().then(docketNumber => {
        openMessagesInboxAsPetitionsClerk();
        openSectionMessages();
        cy.get('[data-testid="messages-outbox-tab"]').click();

        cy.get(
          '[data-testid="messages-section-outbox-subject-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'outbox',
          docketNumber,
          isAscending: true,
          prefix: 'Subject Line',
        });
        cy.get(
          '[data-testid="messages-section-outbox-subject-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'outbox',
          docketNumber,
          isAscending: false,
          prefix: 'Subject Line',
        });

        cy.get(
          '[data-testid="messages-section-outbox-createdAt-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'outbox',
          docketNumber,
          isAscending: true,
          prefix: 'Subject Line',
        });
        cy.get(
          '[data-testid="messages-section-outbox-createdAt-header-button"]',
        ).click();
        verifySubjectTitleOrder({
          boxType: 'outbox',
          docketNumber,
          isAscending: false,
          prefix: 'Subject Line',
        });
      });
    });
  });

  describe('Message Filters', () => {
    describe('Display', () => {
      [
        loginAsAdc,
        loginAsColvin,
        loginAsDocketClerk,
        loginAsAdmissionsClerk,
        loginAsColvinChambers,
        loginAsTrialClerk,
        loginAsReportersOffice,
        loginAsPetitionsClerk,
      ].forEach(loginFunction => {
        it(`should "${loginFunction.name}" and display the filters for Court User `, () => {
          loginFunction();
          cy.visit('/messages/my/inbox');
          cy.get('[data-testid="table-filters-component"]').should(
            'be.visible',
          );

          cy.get('[data-testid="messages-outbox-tab"]').click();
          cy.get('[data-testid="table-filters-component"]').should(
            'be.visible',
          );

          cy.get('[data-testid="messages-completed-tab"]').click();
          cy.get('[data-testid="table-filters-component"]').should('not.exist');

          cy.get('[data-testid="switch-to-section-messages-button"]').click();
          cy.get('[data-testid="table-filters-component"]').should(
            'be.visible',
          );

          cy.get('[data-testid="messages-outbox-tab"]').click();
          cy.get('[data-testid="table-filters-component"]').should(
            'be.visible',
          );

          cy.get('[data-testid="messages-completed-tab"]').click();
          cy.get('[data-testid="table-filters-component"]').should(
            'be.visible',
          );
        });
      });
    });
  });
});

function verifySubjectTitleOrder({
  boxType,
  docketNumber,
  isAscending,
  prefix,
  queueType = 'section',
}: {
  docketNumber: string;
  queueType?: 'individual' | 'section';
  boxType: 'inbox' | 'outbox' | 'completed';
  prefix: string;
  isAscending: boolean;
}) {
  const expectedRows = isAscending
    ? [`${prefix} 1`, `${prefix} 2`, `${prefix} 3`]
    : [`${prefix} 3`, `${prefix} 2`, `${prefix} 1`];

  cy.get(
    `[data-testid="messages-${queueType}-${boxType}-docketNumber-cell"]:contains("${docketNumber}")`,
  ).should($cells => {
    const rows = $cells
      .toArray()
      .map(cell => {
        return (
          cell.parentElement
            ?.querySelector('.message-document-title')
            ?.textContent?.trim() || ''
        );
      })
      .filter(text => text.includes(prefix));

    expect(rows).to.deep.equal(expectedRows);
  });
}

function sendMessages(DOCKET_CLERK_ID: string) {
  for (let i = 0; i < 3; i++) {
    cy.get('[data-testid="case-detail-menu-button"]').click();
    cy.get('[data-testid="menu-button-add-new-message"]').click();
    cy.get('[data-testid="message-to-section"').select('docket');
    cy.get('[data-testid="message-to-user-id"]').select(DOCKET_CLERK_ID);
    cy.get('[data-testid="message-subject"]').type(`Subject Line ${i + 1}`);
    cy.get('[data-testid="message-body"]').type('Message');
    cy.get('[data-testid="modal-confirm"]').click();
    cy.get('[data-testid="success-alert"]').should('exist');
  }
}

function sendMessagesToCompletedTab(DOCKET_CLERK_ID: string) {
  for (let i = 0; i < 3; i++) {
    cy.get('[data-testid="case-detail-menu-button"]').click();
    cy.get('[data-testid="menu-button-add-new-message"]').click();
    cy.get('[data-testid="message-to-section"').select('docket');
    cy.get('[data-testid="message-to-user-id"]').select(DOCKET_CLERK_ID);
    cy.get('[data-testid="message-subject"]').type(`Complete ${i + 1}`);
    cy.get('[data-testid="message-body"]').type('Message');
    cy.get('[data-testid="modal-confirm"]').click();
    cy.get('[data-testid="success-alert"]').should('exist');
  }

  loginAsDocketClerk();
  cy.get('[data-testid="all-messages-checkbox"]').click();
  cy.get('[data-testid="message-batch-mark-as-complete"]').click();
  cy.get('[data-testid="message-detail-success-alert"]').should('exist');
}
