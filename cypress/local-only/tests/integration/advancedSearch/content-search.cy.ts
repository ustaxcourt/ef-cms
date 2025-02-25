import {
  addOrderToDocketEntry,
  createOrder,
} from '../../../../helpers/caseDetail/docketRecord/courtIssuedFiling/create-order-and-decision';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { retry } from '../../../../helpers/retry';

describe('Docket clerk', () => {
  it('should should be able to search for orders using the document contents', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      loginAsDocketClerk1();
      goToCase(docketNumber);
      createOrder({ contents: 'welcome to flavortown' });
      addOrderToDocketEntry();

      createOrder({ contents: 'leaving flavortown' });
      addOrderToDocketEntry();

      cy.get('[data-testid="search-link"]').click();
      cy.get('[data-testid="order-search-tab"]').click();
      cy.get('#docket-number').type(docketNumber);

      cy.get('[data-testid="keyword-search-input"]').type('welcome + leaving');
      cy.get('[data-testid="submit-order-advanced-search-button"]').click();
      cy.get('#no-search-results > .margin-top-4').should('be.visible');

      retry(() => {
        cy.get('[data-testid="keyword-search-input"]').clear();
        cy.get('[data-testid="keyword-search-input"]').type('flavortown');
        cy.get('[data-testid="submit-order-advanced-search-button"]').click();
        return cy.get('body').then(body => {
          return (
            body.find(`[data-testid="docket-number-${docketNumber}"]`)
              .length === 2
          );
        });
      });

      retry(() => {
        cy.get('[data-testid="keyword-search-input"]').clear();
        cy.get('[data-testid="keyword-search-input"]').type('welcome');
        cy.get('[data-testid="submit-order-advanced-search-button"]').click();
        return cy.get('body').then(body => {
          return (
            body.find(`[data-testid="docket-number-${docketNumber}"]`)
              .length === 1
          );
        });
      });

      retry(() => {
        cy.get('[data-testid="keyword-search-input"]').clear();
        cy.get('[data-testid="keyword-search-input"]').type('leaving');
        cy.get('[data-testid="submit-order-advanced-search-button"]').click();
        return cy.get('body').then(body => {
          return (
            body.find(`[data-testid="docket-number-${docketNumber}"]`)
              .length === 1
          );
        });
      });
    });
  });
});
