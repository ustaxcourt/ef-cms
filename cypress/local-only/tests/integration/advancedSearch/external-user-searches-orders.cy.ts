import {
  addOrderToDocketEntry,
  createOrder,
} from '../../../../helpers/caseDetail/docketRecord/courtIssuedFiling/create-order-and-decision';
import { externalUserCreatesElectronicCase } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';
import { retry } from '../../../../helpers/retry';

describe('Private privatePractitioner', () => {
  it('should allow for searching for orders after serving them if not sealed', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      loginAsDocketClerk1();
      goToCase(docketNumber);
      createOrder({ contents: "welcome' & flavortown." });
      addOrderToDocketEntry();

      createOrder({ contents: "leaving' $ flavortown." });
      addOrderToDocketEntry();

      createOrder({ contents: 'welcome to flavortown' });
      addOrderToDocketEntry();

      createOrder({
        contents: 'Coca-cola',
        title: `testing title search ${docketNumber}`,
      });
      addOrderToDocketEntry();

      loginAsPrivatePractitioner();
      cy.get('[data-testid="advanced-search-link"]').click();
      cy.get('[data-testid="order-search-tab"]').click();
      cy.get('#docket-number').type(docketNumber);

      cy.get('[data-testid="keyword-search-input"]').type('welcome + leaving');
      cy.get('[data-testid="submit-order-advanced-search-button"]').click();
      cy.get('#no-search-results > .margin-top-4').should('be.visible');

      retry(() => {
        cy.get('[data-testid="keyword-search-input"]').clear();
        cy.get('[data-testid="keyword-search-input"]').type('& flavortown');
        cy.get('[data-testid="submit-order-advanced-search-button"]').click();
        return cy.get('body').then(body => {
          return (
            body.find(`[data-testid="docket-number-${docketNumber}"]`)
              .length === 3
          );
        });
      });

      retry(() => {
        cy.get('[data-testid="keyword-search-input"]').clear();
        cy.get('[data-testid="keyword-search-input"]').type('"to flavortown"');
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
        cy.get('[data-testid="keyword-search-input"]').type(
          'cola | "welcome to"',
        );
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
        cy.get('[data-testid="keyword-search-input"]').type(
          `testing & ${docketNumber}`,
        );
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
        cy.get('[data-testid="keyword-search-input"]').type('flavortown.');
        cy.get('[data-testid="submit-order-advanced-search-button"]').click();
        return cy.get('body').then(body => {
          return (
            body.find(`[data-testid="docket-number-${docketNumber}"]`)
              .length === 3
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
              .length === 2
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

  it('should not show orders in a sealed case to unassociated user in search results', () => {
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
      cy.get('[data-testid="keyword-search-input"]').clear();
      cy.get('[data-testid="keyword-search-input"]').type('flavortown');
      retry(() => {
        cy.get('[data-testid="submit-order-advanced-search-button"]').click();
        return cy.get('body').then(body => {
          return (
            body.find(`[data-testid="docket-number-${docketNumber}"]`)
              .length === 2
          );
        });
      });

      goToCase(docketNumber);
      cy.get('[data-testid="tab-case-information"] > .button-text').click();
      cy.get('[data-testid="seal-case-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      loginAsPrivatePractitioner();

      cy.get('[data-testid="advanced-search-link"]').click();
      cy.get('[data-testid="order-search-tab"]').click();
      cy.get('#docket-number').type(docketNumber);

      cy.get('[data-testid="keyword-search-input"]').clear();
      cy.get('[data-testid="keyword-search-input"]').type('flavortown');
      cy.get('[data-testid="submit-order-advanced-search-button"]').click();
      cy.get('#no-search-results').should('be.visible');
    });
  });

  it('should not show sealed orders in an unsealed case to unassociated user in search results', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      loginAsDocketClerk1();
      goToCase(docketNumber);
      createOrder({ contents: 'welcome to flavortown' });
      addOrderToDocketEntry();
      createOrder({ contents: 'leaving to flavortown' });
      addOrderToDocketEntry();

      cy.get('[data-testid="seal-docket-entry-button-5"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      loginAsPrivatePractitioner();

      cy.get('[data-testid="advanced-search-link"]').click();
      cy.get('[data-testid="order-search-tab"]').click();
      cy.get('#docket-number').type(docketNumber);

      cy.get('[data-testid="keyword-search-input"]').clear();
      cy.get('[data-testid="keyword-search-input"]').type('flavortown');
      retry(() => {
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

  it('should show sealed-from-public orders in an unsealed case to associated user in search results', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      loginAsDocketClerk1();
      goToCase(docketNumber);
      createOrder({ contents: 'welcome to flavortown' });
      addOrderToDocketEntry();
      createOrder({ contents: 'leaving flavortown' });
      addOrderToDocketEntry();

      cy.get('[data-testid="seal-docket-entry-button-5"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.get('[data-testid="tab-case-information"] > .button-text').click();
      cy.get('[data-testid="tab-parties"] > .button-text').click();
      cy.get('[data-testid="practitioner-search-input"]').clear();
      cy.get('[data-testid="practitioner-search-input"]').type('PT5432');
      cy.get('.usa-search__submit-text').click();
      cy.get('[data-testid="practitioner-representing-0"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      loginAsPrivatePractitioner('privatePractitioner1');

      cy.get('[data-testid="advanced-search-link"]').click();
      cy.get('[data-testid="order-search-tab"]').click();
      cy.get('#docket-number').type(docketNumber);

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
    });
  });

  it('should not show sealed-from-all orders in an unsealed case to associated user in search results', () => {
    loginAsPetitioner();
    externalUserCreatesElectronicCase().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);

      loginAsDocketClerk1();
      goToCase(docketNumber);
      createOrder({ contents: 'welcome to flavortown' });
      addOrderToDocketEntry();
      createOrder({ contents: 'leaving flavortown' });
      addOrderToDocketEntry();

      cy.get('[data-testid="tab-case-information"] > .button-text').click();
      cy.get('[data-testid="tab-parties"] > .button-text').click();
      cy.get('[data-testid="practitioner-search-input"]').clear();
      cy.get('[data-testid="practitioner-search-input"]').type('PT5432');
      cy.get('.usa-search__submit-text').click();
      cy.get('[data-testid="practitioner-representing-0"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      cy.get('[data-testid="tab-docket-record"] > .button-text').click();
      cy.get('[data-testid="seal-docket-entry-button-5"]').click();
      cy.get('#docket-entry-sealed-to-external').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      loginAsPrivatePractitioner('privatePractitioner1');

      cy.get('[data-testid="advanced-search-link"]').click();
      cy.get('[data-testid="order-search-tab"]').click();
      cy.get('#docket-number').type(docketNumber);

      retry(() => {
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
