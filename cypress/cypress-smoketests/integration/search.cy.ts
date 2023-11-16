import { petitionsclerkCreatesAndServesPaperPetition } from '../../helpers/petitionsclerk-creates-and-serves-paper-petition';

describe('search page functionality', () => {
  it('should be able to create a case and serve to IRS', () => {
    petitionsclerkCreatesAndServesPaperPetition().then(docketNumber => {
      cy.get('.usa-link').click();
      cy.getByTestId('petitioner-name').clear();
      cy.getByTestId('petitioner-name').type('rick james');
      cy.getByTestId('case-search-by-name').click();
      cy.getByTestId(`case-result-${docketNumber}`).should('exist');
      cy.getByTestId('clear-search-by-name').click();
      cy.getByTestId(`case-result-${docketNumber}`).should('not.exist');
      cy.getByTestId('docket-number').clear();
      cy.getByTestId('docket-number').type(docketNumber);
      cy.get('#docket-search-button').click();
      cy.url().should('include', `/case-detail/${docketNumber}`);
    });
  });

  it('should be able to search for practitioners by name', () => {
    cy.login('docketclerk1');
    cy.getByTestId('inbox-tab-content').should('exist');
    cy.getByTestId('search-link').click();
    cy.getByTestId('tab-practitioner').click();
    cy.getByTestId('practitioner-name').clear();
    cy.getByTestId('practitioner-name').type('test');
    cy.getByTestId('practitioner-search-by-name-button').click();
    cy.getByTestId('practitioner-row-PT1234').should('exist');
    cy.getByTestId('clear-practitioner-search').click();
    cy.getByTestId('practitioner-row-PT1234').should('not.exist');
    cy.getByTestId('bar-number').clear();
    cy.getByTestId('bar-number').type('pt1234');
    cy.getByTestId('practitioner-search-by-bar-number-button').click();
    cy.url().should('include', 'pt1234');
  });

  it('should be able to search for practitioners by bar number', () => {
    cy.login('docketclerk1');
    cy.getByTestId('inbox-tab-content').should('exist');
    cy.getByTestId('search-link').click();
    cy.getByTestId('tab-practitioner').click();
    cy.getByTestId('bar-number').clear();
    cy.getByTestId('bar-number').type('pt1234');
    cy.getByTestId('practitioner-search-by-bar-number-button').click();
    cy.url().should('include', 'pt1234');
  });

  // it('create an opinion on a case and search for it', () => {
  //   // TODO:
  // })
});
