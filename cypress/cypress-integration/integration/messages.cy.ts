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

import { assertCountOfSelector, retry } from '../../helpers/retry';
import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import {
  getCaseStatusFilter,
  messagesShouldBeFiltered,
  selectsCaseStatusFilterNew,
} from '../support/pages/dashboard';
import { loginAsPetitionsClerk } from '../../helpers/auth/login-as-helpers';
import { searchByDocketNumberInHeader } from '../../helpers/search-by-docket-number-in-header';
import { sortMessageColumnHeader } from '../../helpers/sort-message-column-header';

describe('Messages', () => {
  describe('Message filtering', () => {
    describe('Docket clerk completes qc and sends a message', () => {
      it('should go to section document QC inbox', () => {
        cy.login('docketclerk', '/document-qc/section/inbox');
        cy.get('.big-blue-header').should('exist');
      });

      it('should go to first document needing QC', () => {
        goToDocumentNeedingQC();
      });

      it('should open dialog to complete & send message', () => {
        openCompleteAndSendMessageDialog();
      });

      it('should fill out dialog to complete & send message', () => {
        selectSection('ADC');
        selectRecipient('Test ADC');
        fillOutMessageField();
      });

      it('should send the message', () => {
        sendMessage();
        progressIndicatorDoesNotExist();
      });
    });

    describe('Docket clerk creates and sends a message on a "Calendared" case', () => {
      it('should go to case detail and open the dialog to create a new message', () => {
        cy.login('docketclerk', '/case-detail/103-20');
        createMessage();
      });

      it('should fill out the form and send the new message', () => {
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
      });

      it('should fill out the form and send the new message', () => {
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
      loginAsPetitionsClerk();
      createAndServePaperPetition().then(({ docketNumber }) => {
        cy.wrap(docketNumber).as('DOCKET_NUMBER');
        searchByDocketNumberInHeader(docketNumber);
        sendMessagesToCompletedTab(DOCKET_CLERK_ID, docketNumber);
        cy.login('petitionsclerk');
        searchByDocketNumberInHeader(docketNumber);
        sendMessages(DOCKET_CLERK_ID);
      });
    });

    describe('Individual Message Boxes', () => {
      describe('Sorting on the Individual Message Inbox', () => {
        beforeEach(() => {
          cy.login('docketclerk');
        });

        it('individual inbox subject column', () => {
          sortMessageColumnHeader(
            '[data-testid="message-individual-subject-header-button"]',
            '[data-testid="individual-message-inbox-subject-cell"]',
          ).then(({ afterSorting, beforeSorting }) => {
            cy.wrap(afterSorting).should('deep.equal', beforeSorting.reverse());
          });
        });

        it('individual inbox received at column when defaulted to sort ascending', () => {
          sortMessageColumnHeader(
            '[data-testid="message-individual-received-header-button"]',
            '[data-testid="individual-message-inbox-received-at-cell"]',
          ).then(({ afterSorting, beforeSorting }) => {
            cy.wrap(afterSorting).should('deep.equal', beforeSorting.reverse());
          });
        });

        it('individual inbox docket number column', () => {
          sortMessageColumnHeader(
            '[data-testid="message-individual-docket-number-header-button"]',
            '[data-testid="individual-message-inbox-docket-number-cell"]',
          ).then(({ afterSorting, beforeSorting }) => {
            cy.wrap(afterSorting).should('deep.equal', beforeSorting.sort());
          });
        });
      });

      describe('Sorting on the Individual Message Completed', () => {
        beforeEach(() => {
          cy.login('docketclerk');
          cy.get('[data-testid="messages-completed-tab"]').click();
        });

        it('individual completed subject column', () => {
          sortMessageColumnHeader(
            '[data-testid="message-individual-subject-header-button"]',
            '[data-testid="individual-message-completed-subject-cell"]',
          ).then(({ afterSorting, beforeSorting }) => {
            cy.wrap(afterSorting).should('deep.equal', beforeSorting.reverse());
          });
        });

        it('individual completed completed-at column when defaulted to sort ascending', () => {
          sortMessageColumnHeader(
            '[data-testid="message-individual-completed-at-header-button"]',
            '[data-testid="individual-message-completed-completed-at-cell"]',
          ).then(({ afterSorting, beforeSorting }) => {
            cy.wrap(afterSorting).should('deep.equal', beforeSorting.reverse());
          });
        });

        it('individual completed docket number column', () => {
          sortMessageColumnHeader(
            '[data-testid="message-individual-docket-number-header-button"]',
            '[data-testid="individual-message-completed-docket-number-cell"]',
          ).then(({ afterSorting, beforeSorting }) => {
            cy.wrap(afterSorting).should('deep.equal', beforeSorting.sort());
          });
        });
      });

      describe('Sorting on the Individual Message Outbox', () => {
        beforeEach(() => {
          cy.login('petitionsclerk');
          cy.get('[data-testid="messages-outbox-tab"]').click();
        });

        it('individual outbox subject column', () => {
          sortMessageColumnHeader(
            '[data-testid="message-individual-outbox-subject-header-button"]',
            '[data-testid="individual-message-outbox-subject-cell"]',
          ).then(({ afterSorting, beforeSorting }) => {
            cy.wrap(afterSorting).should('deep.equal', beforeSorting.reverse());
          });
        });

        it('individual outbox completed-at column when defaulted to sort ascending', () => {
          sortMessageColumnHeader(
            '[data-testid="message-individual-outbox-completed-at-header-button"]',
            '[data-testid="individual-message-outbox-completed-at-cell"]',
          ).then(({ afterSorting, beforeSorting }) => {
            cy.wrap(afterSorting).should('deep.equal', beforeSorting.reverse());
          });
        });

        it('individual outbox docket number column', () => {
          sortMessageColumnHeader(
            '[data-testid="message-individual-outbox-docket-number-header-button"]',
            '[data-testid="individual-message-outbox-docket-number-cell"]',
          ).then(({ afterSorting, beforeSorting }) => {
            cy.wrap(afterSorting).should('deep.equal', beforeSorting.reverse());
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
          sortMessageColumnHeader(
            '[data-testid="message-section-subject-header-button"]',
            '[data-testid="section-message-inbox-subject-cell"]',
          ).then(({ afterSorting, beforeSorting }) => {
            cy.wrap(afterSorting).should('deep.equal', beforeSorting.reverse());
          });
        });

        it('Section inbox received at column when defaulted to sort ascending', () => {
          sortMessageColumnHeader(
            '[data-testid="message-section-received-header-button"]',
            '[data-testid="section-message-inbox-received-at-cell"]',
          ).then(({ afterSorting, beforeSorting }) => {
            cy.wrap(afterSorting).should('deep.equal', beforeSorting.reverse());
          });
        });

        it('Section inbox docket number column', () => {
          sortMessageColumnHeader(
            '[data-testid="message-section-docket-number-header-button"]',
            '[data-testid="section-message-inbox-docket-number-cell"]',
          ).then(({ afterSorting, beforeSorting }) => {
            cy.wrap(afterSorting).should('deep.equal', beforeSorting.sort());
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
          sortMessageColumnHeader(
            '[data-testid="message-section-subject-header-button"]',
            '[data-testid="section-message-completed-subject-cell"]',
          ).then(({ afterSorting, beforeSorting }) => {
            cy.wrap(afterSorting).should('deep.equal', beforeSorting.reverse());
          });
        });

        it('section completed completed-at column when defaulted to sort ascending', () => {
          sortMessageColumnHeader(
            '[data-testid="message-section-completed-at-header-button"]',
            '[data-testid="section-message-completed-completed-at-cell"]',
          ).then(({ afterSorting, beforeSorting }) => {
            cy.wrap(afterSorting).should('deep.equal', beforeSorting.reverse());
          });
        });

        it('section completed docket number column', () => {
          sortMessageColumnHeader(
            '[data-testid="message-section-docket-number-header-button"]',
            '[data-testid="section-message-completed-docket-number-cell"]',
          ).then(({ afterSorting, beforeSorting }) => {
            cy.wrap(afterSorting).should('deep.equal', beforeSorting.sort());
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
          cy.get('@DOCKET_NUMBER').then(docketNumber => {
            cy.contains(
              '[data-testid="section-message-outbox-docket-number-cell"]',
              `${docketNumber}`,
            ).each((el, i) => {
              cy.wrap(el.parent())
                .find('.message-document-title')
                .invoke('text')
                .then(text => {
                  if (text.includes('Complete')) {
                    cy.wrap(text).should('equal', `Complete ${3 - i - 1}`);
                  }
                });
            });
          });

          sortMessageColumnHeader(
            '[data-testid="message-section-outbox-created-at-header-button"]',
            '[data-testid="section-message-outbox-created-at-cell"]',
          );

          cy.get('@DOCKET_NUMBER').then(docketNumber => {
            cy.contains(
              '[data-testid="section-message-outbox-docket-number-cell"]',
              `${docketNumber}`,
            ).each((el, i) => {
              cy.wrap(el.parent())
                .find('.message-document-title')
                .invoke('text')
                .then(text => {
                  if (text.includes('Complete')) {
                    cy.wrap(text).should('equal', `Complete ${i + 1}`);
                  }
                });
            });
          });
        });

        it('section outbox created-at column when defaulted to sort ascending', () => {
          sortMessageColumnHeader(
            '[data-testid="message-section-outbox-created-at-header-button"]',
            '[data-testid="section-message-outbox-created-at-cell"]',
          ).then(({ afterSorting, beforeSorting }) => {
            cy.wrap(afterSorting).should('deep.equal', beforeSorting.reverse());
          });
        });

        it('section outbox docket number column', () => {
          sortMessageColumnHeader(
            '[data-testid="message-section-outbox-docket-number-header-button"]',
            '[data-testid="section-message-outbox-docket-number-cell"]',
          ).then(({ afterSorting, beforeSorting }) => {
            cy.wrap(afterSorting).should('deep.equal', beforeSorting.reverse());
          });
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
