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
  login,
  loginAsAdc,
  loginAsDocketClerk,
  loginAsPetitionsClerk,
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
    before(() => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        cy.wrap(docketNumber).as('DOCKET_NUMBER');
        goToCase(docketNumber);
        sendMessagesToCompletedTab(DOCKET_CLERK_ID);
        loginAsPetitionsClerk();
        goToCase(docketNumber);
        sendMessages(DOCKET_CLERK_ID);
      });
    });

    beforeEach(() => {
      cy.keepAliases();
    });

    describe('Individual Message Boxes', () => {
      before(() => {
        loginAsDocketClerk();
      });

      beforeEach(() => {
        cy.visit('/');
      });

      describe('Sorting on the Individual Message Inbox', () => {
        it('individual inbox subject column', () => {
          cy.get(
            '[data-testid="messages-individual-inbox-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: true,
            prefix: 'Subject Line',
            queueType: 'individual',
          });
          cy.get(
            '[data-testid="messages-individual-inbox-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: false,
            prefix: 'Subject Line',
            queueType: 'individual',
          });
        });

        it('individual inbox received at column when defaulted to sort ascending', () => {
          cy.get(
            '[data-testid="messages-individual-inbox-createdAt-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: false,
            prefix: 'Subject Line',
            queueType: 'individual',
          });
          cy.get(
            '[data-testid="messages-individual-inbox-createdAt-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: true,
            prefix: 'Subject Line',
            queueType: 'individual',
          });
        });
      });

      describe('Sorting on the Individual Message Completed', () => {
        it('individual completed subject column', () => {
          cy.get('[data-testid="messages-completed-tab"]').click();
          cy.get(
            '[data-testid="messages-individual-completed-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: true,
            prefix: 'Complete',
            queueType: 'individual',
          });
          cy.get(
            '[data-testid="messages-individual-completed-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: false,
            prefix: 'Complete',
            queueType: 'individual',
          });
        });

        it('individual completed completedAt column when defaulted to sort ascending', () => {
          cy.get('[data-testid="messages-completed-tab"]').click();
          cy.get(
            '[data-testid="messages-individual-completed-completedAt-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: true,
            prefix: 'Complete',
            queueType: 'individual',
          });
          cy.get(
            '[data-testid="messages-individual-completed-completedAt-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: false,
            prefix: 'Complete',
            queueType: 'individual',
          });
        });
      });

      describe('Sorting on the Individual Message Outbox', () => {
        before(() => {
          loginAsPetitionsClerk();
        });

        beforeEach(() => {
          cy.visit('/');
        });

        it('individual outbox subject column', () => {
          cy.get('[data-testid="messages-outbox-tab"]').click();
          cy.get(
            '[data-testid="messages-individual-outbox-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: true,
            prefix: 'Complete',
            queueType: 'individual',
          });
          cy.get(
            '[data-testid="messages-individual-outbox-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: false,
            prefix: 'Complete',
            queueType: 'individual',
          });
        });

        it('individual outbox sent column when defaulted to sort ascending', () => {
          cy.get('[data-testid="messages-outbox-tab"]').click();
          cy.get(
            '[data-testid="messages-individual-outbox-createdAt-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: true,
            prefix: 'Complete',
            queueType: 'individual',
          });
          cy.get(
            '[data-testid="messages-individual-outbox-createdAt-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: false,
            prefix: 'Complete',
            queueType: 'individual',
          });
        });
      });
    });

    describe('Section Message Boxes', () => {
      before(() => {
        loginAsDocketClerk();
      });

      beforeEach(() => {
        cy.visit('/');
      });

      describe('Sorting on the Section Message Inbox', () => {
        it('Section inbox subject column', () => {
          cy.get('[data-testid="switch-to-section-messages-button"]').click();
          cy.get(
            '[data-testid="messages-section-inbox-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: true,
            prefix: 'Subject Line',
          });
          cy.get(
            '[data-testid="messages-section-inbox-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: false,
            prefix: 'Subject Line',
          });
        });

        it('Section inbox received at column when defaulted to sort ascending', () => {
          cy.get('[data-testid="switch-to-section-messages-button"]').click();
          cy.get(
            '[data-testid="messages-section-inbox-subject-header-button"]',
          );
          cy.get(
            '[data-testid="messages-section-inbox-createdAt-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: false,
            prefix: 'Subject Line',
          });
          cy.get(
            '[data-testid="messages-section-inbox-createdAt-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: true,
            prefix: 'Subject Line',
          });
        });
      });

      describe('Sorting on the Section Message Completed', () => {
        it('section completed subject column', () => {
          cy.get('[data-testid="switch-to-section-messages-button"]').click();
          cy.get(
            '[data-testid="messages-section-inbox-subject-header-button"]',
          );
          cy.get('[data-testid="messages-completed-tab"]').click();
          cy.get(
            '[data-testid="messages-section-completed-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: true,
            prefix: 'Complete',
          });
          cy.get(
            '[data-testid="messages-section-completed-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: false,
            prefix: 'Complete',
          });
        });

        it('section completed completed at column when defaulted to sort ascending', () => {
          cy.get('[data-testid="switch-to-section-messages-button"]').click();
          cy.get(
            '[data-testid="messages-section-inbox-subject-header-button"]',
          );
          cy.get('[data-testid="messages-completed-tab"]').click();
          cy.get(
            '[data-testid="messages-section-completed-completedAt-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: true,
            prefix: 'Complete',
          });
          cy.get(
            '[data-testid="messages-section-completed-completedAt-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: false,
            prefix: 'Complete',
          });
        });
      });

      describe('Sorting on the Section Message Outbox', () => {
        before(() => {
          loginAsPetitionsClerk();
        });

        beforeEach(() => {
          cy.visit('/');
        });

        it('section outbox subject column', () => {
          cy.get('[data-testid="switch-to-section-messages-button"]').click();
          cy.get(
            '[data-testid="messages-section-inbox-subject-header-button"]',
          );
          cy.get('[data-testid="messages-outbox-tab"]').click();
          cy.get(
            '[data-testid="messages-section-outbox-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: true,
            prefix: 'Subject Line',
          });
          cy.get(
            '[data-testid="messages-section-outbox-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: false,
            prefix: 'Subject Line',
          });
        });

        it('section outbox sent column when defaulted to sort ascending', () => {
          loginAsPetitionsClerk();
          cy.get('[data-testid="switch-to-section-messages-button"]').click();
          cy.get(
            '[data-testid="messages-section-inbox-subject-header-button"]',
          );
          cy.get('[data-testid="messages-outbox-tab"]').click();
          cy.get(
            '[data-testid="messages-section-outbox-createdAt-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: true,
            prefix: 'Subject Line',
          });
          cy.get(
            '[data-testid="messages-section-outbox-createdAt-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: false,
            prefix: 'Subject Line',
          });
        });
      });
    });
  });

  describe('Message Filters', () => {
    describe('Display', () => {
      [
        'adc@example.com',
        'judgecolvin@example.com',
        'docketclerk@example.com',
        'admissionsclerk@example.com',
        'colvinschambers@example.com',
        'trialclerk@example.com',
        'reportersoffice@example.com',
        'petitionsclerk@example.com',
        'general@example.com',
      ].forEach(account => {
        it(`should display the filters for Court User "${account}"`, () => {
          login({ email: account });
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
  isAscending,
  prefix,
  queueType = 'section',
}: {
  queueType?: 'individual' | 'section';
  boxType: 'inbox' | 'outbox' | 'completed';
  prefix: string;
  isAscending: boolean;
}) {
  cy.get('@DOCKET_NUMBER').then(docketNumber => {
    const rows: string[] = [];
    cy.get(
      `[data-testid="messages-${queueType}-${boxType}-docketNumber-cell"]:contains("${docketNumber}")`,
    ).each(el => {
      cy.wrap(el.parent())
        .find('.message-document-title')
        .invoke('text')
        .then(text => {
          if (text.includes(prefix)) {
            rows.push(text);
          }
        });
    });
    cy.wrap(rows).each((text, i) => {
      if (isAscending) {
        cy.wrap(text).should('equal', `${prefix} ${i + 1}`);
      } else {
        cy.wrap(text).should('equal', `${prefix} ${3 - i}`);
      }
    });
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
