import { faker } from '@faker-js/faker';
import { loginAsDocketClerk1 } from 'cypress/helpers/authentication/login-as-helpers';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import {
  createAndServePaperPetition,
  createAndServePaperPetitionMyselfAndSpouse,
} from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { navigateToDashboard } from 'cypress/local-only/support/pages/maintenance';
import { searchForCaseByDocketNumber } from 'cypress/local-only/support/pages/public/advanced-search';

describe('Case Search', () => {
  describe('Case Search By Name', () => {
    it('should show order search results by [petitioner name, secondary contact name, case caption] when searching', () => {
      const nameToSearchFor = `${faker.person.firstName()} ${faker.person.lastName()}`;
      createAndServePaperPetition({ name: nameToSearchFor }).then(
        ({ docketNumber: primaryContactDocketNumber }) => {
          createAndServePaperPetitionMyselfAndSpouse({
            secondaryContactName: nameToSearchFor,
          }).then(({ docketNumber: secondaryContactDocketNumber }) => {
            createAndServePaperPetition().then(
              ({ docketNumber: caseCaptionDocketNumber }) => {
                const updatedCaseCaption = `${nameToSearchFor}, name on caseCaption, third-best match, Petitioner`;
                loginAsDocketClerk1();
                goToCase(caseCaptionDocketNumber);
                cy.get('[data-testid=tab-case-information]').click();
                cy.get('[data-testid=menu-edit-case-context-button]').click();
                cy.get('[data-testid=edit-case-caption-textarea]').clear();
                cy.get('[data-testid=edit-case-caption-textarea]').type(
                  updatedCaseCaption,
                );
                cy.get('[data-testid="modal-button-confirm"]').click();
                cy.get('[data-testid="success-alert"]').should('be.visible');

                cy.visit('/');
                cy.get('[data-testid=petitioner-name]').type(nameToSearchFor);
                cy.get(
                  '[data-testid=submit-case-search-by-name-button]',
                ).click();

                cy.get(
                  //7355: Primary contact Name is most important
                  `[data-testid=advanced-case-search-result-${primaryContactDocketNumber}]`,
                ).find(`[data-testid=advanced-case-search-result-order-${0}]`);
                cy.get(
                  //7355: Secondary contact name is second most important
                  `[data-testid=advanced-case-search-result-${secondaryContactDocketNumber}]`,
                ).find(`[data-testid=advanced-case-search-result-order-${1}]`);
                cy.get(
                  //7355: Case caption is third most important
                  `[data-testid=advanced-case-search-result-${caseCaptionDocketNumber}]`,
                ).find(`[data-testid=advanced-case-search-result-order-${2}]`);
              },
            );
          });
        },
      );
    });

    it.only('should show partial matches for petitioner name and secondary contact', () => {
      const primaryLastName = faker.person.lastName();
      const secondaryLastName = faker.person.lastName();
      const secondaryName = `Terrance ${secondaryLastName}`;
      const primaryName = `Jade ${primaryLastName}`;

      createAndServePaperPetitionMyselfAndSpouse({
        secondaryContactName: secondaryName,
        primaryContactName: primaryName,
      }).then(({ docketNumber }) => {
        cy.visit('/');
        cy.get('[data-testid=petitioner-name]').clear();
        cy.get('[data-testid=petitioner-name]').type(primaryLastName);
        cy.get('[data-testid=submit-case-search-by-name-button]').click();
        cy.get(
          `[data-testid=advanced-case-search-result-${docketNumber}]`,
        ).find(`[data-testid=advanced-case-search-result-order-${0}]`);

        cy.get('[data-testid=petitioner-name]').clear();
        cy.get('[data-testid=petitioner-name]').type(secondaryLastName);        cy.get('[data-testid=submit-case-search-by-name-button]').click();
        cy.get(
          `[data-testid=advanced-case-search-result-${docketNumber}]`,
        ).find(`[data-testid=advanced-case-search-result-order-${0}]`);
      });
    });
  });

  describe('case - by docket number', () => {
    it('should display "No Matches Found" when case search yields no results', () => {
      navigateToDashboard();
      searchForCaseByDocketNumber('999-99');
      cy.get('div#no-search-results');
    });

    it('should route to case detail when a case search match is found', () => {
      navigateToDashboard();
      searchForCaseByDocketNumber('103-20');
      cy.get('table#docket-record-table');
    });
  });
});
