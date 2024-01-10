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

import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import {
  getCaseStatusFilter,
  messagesShouldBeFiltered,
  selectsCaseStatusFilterNew,
} from '../support/pages/dashboard';
import { loginAsPetitionsClerk } from '../../helpers/auth/login-as-helpers';
import { searchByDocketNumberInHeader } from '../../helpers/search-by-docket-number-in-header';

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
      //send messages
      loginAsPetitionsClerk();
      createAndServePaperPetition().then(({ docketNumber }) => {
        cy.wrap(docketNumber).as('DOCKET_NUMBER');
        searchByDocketNumberInHeader(docketNumber);

        // completed messages
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
        //mark all as complete
        cy.login('docketclerk');
        for (let i = 0; i < 3; i++) {
          cy.get(`a[href^="/messages/${docketNumber}/message-detail"]`)
            .eq(0)
            .click();
          cy.get('[data-testid="message-mark-as-complete"]').click();
          cy.get('[data-testid="complete-message-body"]').type(
            'MARK AS COMPLETE',
          );
          cy.get('[data-testid="modal-confirm"]').click();
          cy.get('[data-testid="message-detail-warning-alert"]').should(
            'exist',
          );
          // cy.wait(1500);
          cy.get('[data-testid="header-messages-link"]').click();
        }
        cy.login('petitionsclerk');
        searchByDocketNumberInHeader(docketNumber);

        // inbox
        for (let i = 0; i < 3; i++) {
          cy.get('[data-testid="case-detail-menu-button"]').click();
          cy.get('[data-testid="menu-button-add-new-message"]').click();
          cy.get('[data-testid="message-to-section"').select('docket');
          cy.get('[data-testid="message-to-user-id"]').select(DOCKET_CLERK_ID);
          cy.get('[data-testid="message-subject"]').type(
            `Subject Line ${i + 1}`,
          );
          cy.get('[data-testid="message-body"]').type('Message');
          cy.get('[data-testid="modal-confirm"]').click();
          cy.get('[data-testid="success-alert"]').should('exist');
        }
      });
    });

    it('should verify the sorting works on the message inbox', () => {
      cy.login('docketclerk');
      // cy.get<string>('@DOCKET_NUMBER').then(docketNumber => {
      //   console.log('docketNumber', docketNumber);
      // });
    });
    // it.skip('should verify the sorting works on the message outbox', () => {});
    // it.skip('should verify the sorting works on the message completed', () => {});
  });
});
