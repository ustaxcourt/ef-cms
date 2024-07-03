import {
  addOrderToDocketEntry,
  createOrder,
} from '../../../../helpers/caseDetail/docketRecord/courtIssuedFiling/create-order-and-decision';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { petitionerCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { retry } from '../../../../helpers/retry';

describe('Docket clerk', () => {
  it('should should be able to search for orders using the case title', () => {
    const titleId = Math.random() + '';
    loginAsPetitioner();
    petitionerCreatesElectronicCase(`John${titleId}`).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      loginAsDocketClerk1();
      goToCase(docketNumber);
      createOrder({});
      addOrderToDocketEntry();
    });

    loginAsPetitioner();
    petitionerCreatesElectronicCase(`Bob${titleId}`).then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      loginAsDocketClerk1();
      goToCase(docketNumber);
      createOrder({});
      addOrderToDocketEntry();
    });

    cy.get('[data-testid="search-link"]').click();
    cy.get('[data-testid="order-search-tab"]').click();

    cy.get('[data-testid="keyword-search-input"]').type('welcome + leaving');
    cy.get('[data-testid="submit-order-advanced-search-button"]').click();
    cy.get('#no-search-results > .margin-top-4').should('be.visible');

    retry(() => {
      cy.get('[data-testid="keyword-search-input"]').clear();
      cy.get('#title-or-name').clear();
      cy.get('#title-or-name').type(`John${titleId}`);
      cy.get('[data-testid="submit-order-advanced-search-button"]').click();
      return cy.get('body').then(body => {
        return body.find('.search-result').length === 1;
      });
    });

    retry(() => {
      cy.get('[data-testid="keyword-search-input"]').clear();
      cy.get('#title-or-name').clear();
      cy.get('#title-or-name').type(`Bob${titleId}`);
      cy.get('[data-testid="submit-order-advanced-search-button"]').click();
      return cy.get('body').then(body => {
        return body.find('.search-result').length === 1;
      });
    });

    retry(() => {
      cy.get('[data-testid="keyword-search-input"]').clear();
      cy.get('#title-or-name').clear();
      cy.get('#title-or-name').type(`Rick${titleId}`);
      cy.get('[data-testid="submit-order-advanced-search-button"]').click();
      return cy.get('body').then(body => {
        return body.find('.search-result').length === 0;
      });
    });

    cy.get('#title-or-name').clear();
    cy.get('#title-or-name').type('nope');
    cy.get('[data-testid="submit-order-advanced-search-button"]').click();
    cy.get('#no-search-results > .margin-top-4').should('be.visible');
  });
});
