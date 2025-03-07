import {
  createMessage,
  enterSubject,
  fillOutMessageField,
  selectChambers,
  selectRecipient,
  selectSection,
  sendMessage,
} from '../../../../support/pages/document-qc';
import { fillInCreateCaseFromPaperForm } from '../../../../support/pages/create-paper-petition';

import { getCreateACaseButton } from '../../../../support/pages/document-qc';
import {
  loginAsColvin,
  loginAsColvinChambers,
  loginAsDocketClerk,
  loginAsPetitionsClerk,
} from 'cypress/helpers/authentication/login-as-helpers';

describe('Notes Icon triggered by Judges Notes', () => {
  let newDocketNumber: string;
  beforeEach(() => {
    loginAsPetitionsClerk();
    cy.visit('/document-qc');

    getCreateACaseButton().click();
    cy.get('#tab-parties').should('have.attr', 'aria-selected');

    fillInCreateCaseFromPaperForm();

    cy.intercept('POST', '**/paper').as('postPaperCase');
    cy.get('#submit-case').click();

    cy.wait('@postPaperCase').then(({ response }) => {
      if (!response || !response.body?.caseDetail.docketNumber) {
        throw new Error(
          'Unable to get Docket Number from postPaperCase HTTP request',
        );
      }
      newDocketNumber = response.body?.caseDetail.docketNumber;
    });
  });

  it('should display the notes icon when logged in as a judge user and there are judges notes on the case we navigated to using the messages link', () => {
    loginAsColvin();
    cy.visit(`/case-detail/${newDocketNumber}`);
    cy.get('[data-testid="tab-notes"]').click();
    cy.get('[data-testid="add-case-judge-notes-button"]').click();
    cy.get('[data-testid="case-notes"]').type('SOME RANDOM NOTES');
    cy.get('#confirm').click();

    loginAsDocketClerk();
    cy.visit(`/case-detail/${newDocketNumber}`);
    createMessage();
    selectSection('Chambers');
    selectChambers('colvinsChambers');
    selectRecipient('Judge Colvin');
    enterSubject();
    fillOutMessageField();
    sendMessage();

    loginAsColvin();
    cy.get('[data-testid="message-header-link"]').first().click();
    cy.get('[data-testid="notes-icon"]').should('exist');
  });

  it('should display the notes icon when logged in as a chambers user and there are judges notes on the case we navigated to using the messages link', () => {
    loginAsColvin();
    cy.visit(`/case-detail/${newDocketNumber}`);
    cy.get('[data-testid="tab-notes"]').click();
    cy.get('[data-testid="add-case-judge-notes-button"]').click();
    cy.get('[data-testid="case-notes"]').type('SOME RANDOM NOTES');
    cy.get('#confirm').click();

    loginAsDocketClerk();
    cy.visit(`/case-detail/${newDocketNumber}`);
    createMessage();
    selectSection('Chambers');
    selectChambers('colvinsChambers');
    selectRecipient("Test Colvin's Chambers");
    enterSubject();
    fillOutMessageField();
    sendMessage();

    loginAsColvinChambers();
    cy.get('[data-testid="message-header-link"]').first().click();
    cy.get('[data-testid="notes-icon"]').should('exist');
  });
});
