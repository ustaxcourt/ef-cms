import { isValidRequest } from '../../../../readonly/support/helpers';

describe('Public User - Search', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display all search tabs', () => {
    cy.get('[data-testid="tabs-menu"]').find('li').should('have.length', 4);

    ['Case', 'Order', 'Opinion', 'Practitioner'].forEach(
      (title: string, index: number) => {
        cy.get('[data-testid="tabs-menu"]')
          .find('li')
          .eq(index)
          .invoke('text')
          .should('contain', title);
      },
    );
  });

  describe('Practitioner', () => {
    beforeEach(() => {
      cy.get('[data-testid="tabs-menu"]').find('li').eq(3).click();

      cy.intercept({
        method: 'GET',
        url: '/public-api/practitioners?name=test',
      }).as('getPractitionerByName');

      cy.intercept({
        method: 'GET',
        url: '/public-api/practitioners/test',
      }).as('getPractitionerByBarNumber');
    });

    it('should send the correct request when searching practitioner by Name and Bar Number', () => {
      cy.get('input#practitioner-name').type('test');
      cy.get('button#practitioner-search-by-name-button').click();
      cy.wait('@getPractitionerByName').then(isValidRequest);

      cy.get('input#bar-number').type('test');
      cy.get('button#practitioner-search-by-bar-number-button').click();
      cy.wait('@getPractitionerByBarNumber').then(isValidRequest);
    });
  });
});
