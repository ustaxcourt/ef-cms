import { assertCountOfSelector, retry } from '../../helpers/retry';
import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
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
} from '../support/pages/document-qc';
import {
  getCaseStatusFilter,
  messagesShouldBeFiltered,
  selectsCaseStatusFilterNew,
} from '../support/pages/dashboard';
import { loginAsPetitionsClerk } from '../../helpers/auth/login-as-helpers';
import { searchByDocketNumberInHeader } from '../../helpers/search-by-docket-number-in-header';

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
      `[data-testid="${queueType}-message-${boxType}-docket-number-cell"]:contains("${docketNumber}")`,
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

describe('Messages', () => {
  describe('Message filtering', () => {
    describe('Docket clerk completes qc and sends a message', () => {
      it('should go to section document QC inbox, complete an item needing qc, and send a message', () => {
        cy.login('docketclerk', '/document-qc/section/inbox');
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
        cy.login('docketclerk', '/case-detail/103-20');
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
        cy.login('docketclerk', '/case-detail/102-20');
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
        cy.login('adc');
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
        searchByDocketNumberInHeader(docketNumber);
        sendMessagesToCompletedTab(DOCKET_CLERK_ID, docketNumber);
        loginAsPetitionsClerk();
        searchByDocketNumberInHeader(docketNumber);
        sendMessages(DOCKET_CLERK_ID);
      });
    });

    beforeEach(() => {
      cy.keepAliases();
    });

    describe('Individual Message Boxes', () => {
      describe('Sorting on the Individual Message Inbox', () => {
        beforeEach(() => {
          cy.login('docketclerk');
        });

        it('individual inbox subject column', () => {
          cy.get(
            '[data-testid="message-individual-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: true,
            prefix: 'Subject Line',
            queueType: 'individual',
          });
          cy.get(
            '[data-testid="message-individual-subject-header-button"]',
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
            '[data-testid="message-individual-received-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: false,
            prefix: 'Subject Line',
            queueType: 'individual',
          });
          cy.get(
            '[data-testid="message-individual-received-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: true,
            prefix: 'Subject Line',
            queueType: 'individual',
          });
        });

        it('individual inbox docket number column', () => {
          cy.get(
            '[data-testid="message-individual-docket-number-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: false,
            prefix: 'Subject Line',
            queueType: 'individual',
          });
          cy.get(
            '[data-testid="message-individual-docket-number-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: false,
            prefix: 'Subject Line',
            queueType: 'individual',
          });
        });
      });

      describe('Sorting on the Individual Message Completed', () => {
        beforeEach(() => {
          cy.login('docketclerk');
          cy.get('[data-testid="messages-completed-tab"]').click();
        });

        it('individual completed subject column', () => {
          cy.get(
            '[data-testid="message-individual-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: true,
            prefix: 'Complete',
            queueType: 'individual',
          });
          cy.get(
            '[data-testid="message-individual-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: false,
            prefix: 'Complete',
            queueType: 'individual',
          });
        });

        it('individual completed completed-at column when defaulted to sort ascending', () => {
          cy.get(
            '[data-testid="message-individual-completed-at-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: true,
            prefix: 'Complete',
            queueType: 'individual',
          });
          cy.get(
            '[data-testid="message-individual-completed-at-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: false,
            prefix: 'Complete',
            queueType: 'individual',
          });
        });

        it('individual completed docket number column', () => {
          cy.get(
            '[data-testid="message-individual-docket-number-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: true,
            prefix: 'Complete',
            queueType: 'individual',
          });
          cy.get(
            '[data-testid="message-individual-docket-number-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: true,
            prefix: 'Complete',
            queueType: 'individual',
          });
        });
      });

      describe('Sorting on the Individual Message Outbox', () => {
        beforeEach(() => {
          cy.login('petitionsclerk');
          cy.get('[data-testid="messages-outbox-tab"]').click();
        });

        it('individual outbox subject column', () => {
          cy.get(
            '[data-testid="message-individual-outbox-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: true,
            prefix: 'Complete',
            queueType: 'individual',
          });
          cy.get(
            '[data-testid="message-individual-outbox-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: false,
            prefix: 'Complete',
            queueType: 'individual',
          });
        });

        it('individual outbox completed-at column when defaulted to sort ascending', () => {
          cy.get(
            '[data-testid="message-individual-outbox-completed-at-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: true,
            prefix: 'Complete',
            queueType: 'individual',
          });
          cy.get(
            '[data-testid="message-individual-outbox-completed-at-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: false,
            prefix: 'Complete',
            queueType: 'individual',
          });
        });

        it('individual outbox docket number column', () => {
          cy.get(
            '[data-testid="message-individual-outbox-docket-number-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: true,
            prefix: 'Complete',
            queueType: 'individual',
          });
          cy.get(
            '[data-testid="message-individual-outbox-docket-number-header-button"]',
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
      describe('Sorting on the Section Message Inbox', () => {
        beforeEach(() => {
          cy.login('docketclerk');
          cy.get('[data-testid="switch-to-section-messages-button"]').click();
          cy.get(
            '[data-testid="message-section-subject-header-button"]',
          ).should('exist');
        });

        it('Section inbox subject column', () => {
          cy.get(
            '[data-testid="message-section-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: true,
            prefix: 'Subject Line',
          });
          cy.get(
            '[data-testid="message-section-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: false,
            prefix: 'Subject Line',
          });
        });

        it('Section inbox received at column when defaulted to sort ascending', () => {
          cy.get(
            '[data-testid="message-section-received-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: false,
            prefix: 'Subject Line',
          });
          cy.get(
            '[data-testid="message-section-received-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: true,
            prefix: 'Subject Line',
          });
        });

        it('Section inbox docket number column', () => {
          cy.get(
            '[data-testid="message-section-docket-number-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: false,
            prefix: 'Subject Line',
          });
          cy.get(
            '[data-testid="message-section-docket-number-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'inbox',
            isAscending: false,
            prefix: 'Subject Line',
          });
        });
      });

      describe('Sorting on the Section Message Completed', () => {
        beforeEach(() => {
          cy.login('docketclerk');
          cy.get('[data-testid="switch-to-section-messages-button"]').click();
          cy.get(
            '[data-testid="message-section-subject-header-button"]',
          ).should('exist');
          cy.get('[data-testid="messages-completed-tab"]').click();
        });

        it('section completed subject column', () => {
          cy.get(
            '[data-testid="message-section-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: true,
            prefix: 'Complete',
          });
          cy.get(
            '[data-testid="message-section-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: false,
            prefix: 'Complete',
          });
        });

        it('section completed completed-at column when defaulted to sort ascending', () => {
          cy.get(
            '[data-testid="message-section-completed-at-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: true,
            prefix: 'Complete',
          });
          cy.get(
            '[data-testid="message-section-completed-at-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: false,
            prefix: 'Complete',
          });
        });

        it('section completed docket number column', () => {
          cy.get(
            '[data-testid="message-section-docket-number-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: true,
            prefix: 'Complete',
          });
          cy.get(
            '[data-testid="message-section-docket-number-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'completed',
            isAscending: true,
            prefix: 'Complete',
          });
        });
      });

      describe('Sorting on the Section Message Outbox', () => {
        beforeEach(() => {
          cy.login('petitionsclerk');
          cy.get('[data-testid="switch-to-section-messages-button"]').click();
          cy.get(
            '[data-testid="message-section-subject-header-button"]',
          ).should('exist');
          cy.get('[data-testid="messages-outbox-tab"]').click();
        });

        it('section outbox subject column', () => {
          cy.get(
            '[data-testid="message-section-outbox-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: true,
            prefix: 'Subject Line',
          });
          cy.get(
            '[data-testid="message-section-outbox-subject-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: false,
            prefix: 'Subject Line',
          });
        });

        it('section outbox created-at column when defaulted to sort ascending', () => {
          cy.get(
            '[data-testid="message-section-outbox-created-at-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: true,
            prefix: 'Subject Line',
          });
          cy.get(
            '[data-testid="message-section-outbox-created-at-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: false,
            prefix: 'Subject Line',
          });
        });

        it('section outbox docket number column', () => {
          cy.get(
            '[data-testid="message-section-outbox-docket-number-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: true,
            prefix: 'Subject Line',
          });
          cy.get(
            '[data-testid="message-section-outbox-docket-number-header-button"]',
          ).click();
          verifySubjectTitleOrder({
            boxType: 'outbox',
            isAscending: true,
            prefix: 'Subject Line',
          });
        });
      });
    });
  });

  describe('Message Filters', () => {
    describe('Display', () => {
      [
        'adc',
        'judgecolvin',
        'docketclerk',
        'admissionsclerk',
        'colvinschambers',
        'trialclerk',
        'reportersoffice',
        'petitionsclerk',
        'general',
      ].forEach(account => {
        it(`should display the filters for Court User "${account}"`, () => {
          cy.login(account, '/messages/my/inbox');
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

function sendMessagesToCompletedTab(
  DOCKET_CLERK_ID: string,
  docketNumber: string,
) {
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

  cy.login('docketclerk');
  for (let i = 0; i < 3; i++) {
    cy.get(`a[href^="/messages/${docketNumber}/message-detail"]`).eq(0).click();
    cy.get('[data-testid="message-mark-as-complete"]').click();
    cy.get('[data-testid="complete-message-body"]').type('MARK AS COMPLETE');
    cy.get('[data-testid="modal-confirm"]').click();
    cy.get('[data-testid="message-detail-warning-alert"]').should('exist');
    cy.get('[data-testid="header-messages-link"]').click();
    retry(() => {
      cy.reload(true);
      cy.get('[data-testid="inbox-tab-content"]').should('exist');
      return assertCountOfSelector(
        `a[href^="/messages/${docketNumber}/message-detail"]`,
        2 - i,
      );
    });
  }
}
