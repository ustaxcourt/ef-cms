import {
  createMessage,
  enterSubject,
  fillOutMessageField,
  selectChambers,
  selectRecipient,
  selectSection,
  sendMessage,
} from '../../../support/pages/document-qc';
import { fillInCreateCaseFromPaperForm } from '../../../support/pages/create-paper-petition';

import {
  getCreateACaseButton,
  navigateTo as navigateToDocumentQC,
} from '../../../support/pages/document-qc';

describe('Notes Icon triggered by Judges Notes', () => {
  let newDocketNumber: string;
  beforeEach(() => {
    navigateToDocumentQC('petitionsclerk');

    getCreateACaseButton().click();
    cy.get('#tab-parties').parent().should('have.attr', 'aria-selected');

    fillInCreateCaseFromPaperForm();

    cy.intercept('POST', '**/paper').as('postPaperCase');
    cy.get('#submit-case').click();

    cy.wait('@postPaperCase').then(({ response }) => {
      if (!response || !response.body?.docketNumber) {
        throw new Error(
          'Unable to get Docket Number from postPaperCase HTTP request',
        );
      }
      newDocketNumber = response.body?.docketNumber;
    });
  });

  it('should display the notes icon when logged in as a judge user and there are judges notes on the case we navigated to using the messages link', () => {
    cy.login('judgecolvin', `/case-detail/${newDocketNumber}`);
    cy.get('[data-testid="tab-notes"]').click();
    cy.get('[data-testid="add-case-judge-notes-button"]').click();
    cy.get('[data-testid="case-notes"]').type('SOME RANDOM NOTES');
    cy.get('#confirm').click();

    cy.login('docketclerk', `/case-detail/${newDocketNumber}`);
    createMessage();
    selectSection('Chambers');
    selectChambers('colvinsChambers');
    selectRecipient('Judge Colvin');
    enterSubject();
    fillOutMessageField();
    sendMessage();

    cy.login('judgecolvin');
    cy.get('[data-testid="message-header-link"]').first().click();
    cy.get('[data-testid="notes-icon"]').should('exist');
  });

  it('should display the notes icon when logged in as a chambers user and there are judges notes on the case we navigated to using the messages link', () => {
    cy.login('judgecolvin', `/case-detail/${newDocketNumber}`);
    cy.get('[data-testid="tab-notes"]').click();
    cy.get('[data-testid="add-case-judge-notes-button"]').click();
    cy.get('[data-testid="case-notes"]').type('SOME RANDOM NOTES');
    cy.get('#confirm').click();

    cy.login('docketclerk', `/case-detail/${newDocketNumber}`);
    createMessage();
    selectSection('Chambers');
    selectChambers('colvinsChambers');
    selectRecipient("Test Colvin's Chambers");
    enterSubject();
    fillOutMessageField();
    sendMessage();

    cy.login('colvinschambers');
    cy.get('[data-testid="message-header-link"]').first().click();
    cy.get('[data-testid="notes-icon"]').should('exist');
  });
});
