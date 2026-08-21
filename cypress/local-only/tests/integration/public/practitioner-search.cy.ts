import { selectTypeaheadInput } from 'cypress/helpers/components/typeAhead/select-typeahead-input';
import { isValidRequest } from '../../../../readonly/support/helpers';
import { loginAsAdmissionsClerk } from 'cypress/helpers/authentication/login-as-helpers';
import { createAPractitioner } from 'cypress/helpers/accountCreation/create-a-practitioner';
import { logout } from 'cypress/helpers/authentication/logout';

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

    describe('Name', () => {
    it('should send the correct request when searching practitioner by Name and Bar Number', () => {
      cy.get('input#practitioner-name').type('test');
      cy.get('button#practitioner-search-by-name-button').click();
      cy.wait('@getPractitionerByName').then(isValidRequest);

      cy.get('input#bar-number').type('test');
      cy.get('button#practitioner-search-by-bar-number-button').click();
      cy.wait('@getPractitionerByBarNumber').then(isValidRequest);
    });

    it('should filter by Original Bar State', () => {
      cy.get('input#practitioner-name').type('test');
      selectTypeaheadInput('original-bar-state-filter', 'California');
      cy.get('[data-testid="practitioner-search-by-name-button"]').click();

      cy.get('[data-testid^="practitioner-row-"]')
        .should('have.length.greaterThan', 0)
        .each($row => {
          cy.wrap($row).should('contain.text', 'California');
        });
    });

    it('should return results when searching practitioner by name and hitting enter', () => {
      cy.get('input#practitioner-name').type('test');
      cy.get('input#practitioner-name').type('{enter}');
      cy.get('[data-testid^="practitioner-row-"]')
        .should('have.length.greaterThan', 0)
    }); 
    })

    describe('Bar Number', () => {
      it('should return results when searching practitioner by bar number and hitting enter', () => {

        loginAsAdmissionsClerk();
        createAPractitioner().then(({ barNumber }) => {

          logout();
          cy.visit('/');
          cy.get('[data-testid="tabs-menu"]').find('li').eq(3).click();
          cy.get('[data-testid="bar-number-search-input"]').type(barNumber);
          cy.get('[data-testid="bar-number-search-input"]').type('{enter}');
          cy.get('[data-testid^="practitioner-row-"]')
            .should('have.length.greaterThan', 0)
        });
      });
    })
  });
});
