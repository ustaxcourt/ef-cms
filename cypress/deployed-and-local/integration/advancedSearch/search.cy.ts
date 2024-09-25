import { assertExists, retry } from '../../../helpers/retry';
import { createAPractitioner } from '../../../helpers/accountCreation/create-a-practitioner';
import { createAndServePaperPetition } from '../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { faker } from '@faker-js/faker';
import { goToCase } from '../../../helpers/caseDetail/go-to-case';
import {
  loginAsAdmissionsClerk,
  loginAsDocketClerk1,
  loginAsPetitionsClerk1,
} from '../../../helpers/authentication/login-as-helpers';
import { selectTypeaheadInput } from '../../../helpers/components/typeAhead/select-typeahead-input';

describe('Advanced Search', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should find a served paper case when the user searches by party name or docket number', () => {
    /** Arrange */
    createAndServePaperPetition().then(({ docketNumber, name }) => {
      /** Act */
      cy.get('[data-testid="search-link"]').click();
      cy.get('[data-testid="petitioner-name"]').type(name);

      /** Assert */
      // need to wait for elasticsearch potentially
      retry(() => {
        cy.get('[data-testid="submit-case-search-by-name-button"]').click();
        return assertExists(`[data-testid="case-result-${docketNumber}"]`);
      });
    });
  });

  it('should return practitioner results when the user searches by name', () => {
    /** Arrange */
    loginAsAdmissionsClerk();
    createAPractitioner().then(({ barNumber, firstName }) => {
      /** Act */
      cy.get('[data-testid="search-link"]').click();
      cy.get('[data-testid="practitioner-search-tab"]').click();
      cy.get('[data-testid="practitioner-name-input"]').type(firstName);

      /** Assert */
      retry(() => {
        cy.get('[data-testid="practitioner-search-by-name-button"]').click();
        return assertExists(`[data-testid="practitioner-row-${barNumber}"]`);
      });
      cy.get('[data-testid="practitioner-search-result-count"]').should(
        'exist',
      );
      cy.get('[data-testid="clear-practitioner-search"]').click();
      cy.get(`[data-testid="practitioner-row-${barNumber}"]`).should(
        'not.exist',
      );
    });
  });

  it('should return no results when the user searches for practitioner that does not exist', () => {
    /** Arrange */
    loginAsAdmissionsClerk();

    /** Act */
    cy.get('[data-testid="search-link"]').click();
    cy.get('[data-testid="practitioner-search-tab"]').click();
    cy.get('[data-testid="practitioner-name-input"]').type('doesNotExist');

    /** Assert */
    retry(() => {
      cy.get('[data-testid="practitioner-search-by-name-button"]').click();
      return assertExists('[data-testid="no-search-results"]');
    });
    cy.get('[data-testid="clear-practitioner-search"]').click();
    cy.get('[data-testid="no-search-results"]').should('not.exist');
  });

  it('should find a practitioner and route to the practitioner detail page when the user searches by bar number', () => {
    /** Arrange */
    loginAsAdmissionsClerk();
    createAPractitioner().then(({ barNumber }) => {
      /** Act */
      cy.get('[data-testid="search-link"]').click();
      cy.get('[data-testid="practitioner-search-tab"]').click();
      cy.get('[data-testid="bar-number-search-input"]').type(barNumber);
      cy.get(
        '[data-testid="practitioner-search-by-bar-number-button"]',
      ).click();

      /** Assert */
      cy.url().should('include', barNumber);
      cy.get('[data-testid="print-practitioner-case-list"]').click();
      cy.get('dialog.modal-screen').should('exist');
      cy.get('h3:contains("Printable Case List")').should('be.visible');
    });
  });

  it('should find matching results when the user searches for an opinion by keyword', () => {
    /** Arrange */
    loginAsPetitionsClerk1();
    createAndServePaperPetition().then(({ docketNumber }) => {
      loginAsDocketClerk1();

      goToCase(docketNumber);

      const opinionTitle = `${faker.word.adjective()} ${faker.word.noun()}`;
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-upload-pdf"]').click();
      cy.get('[data-testid="upload-description"]').type(opinionTitle);
      cy.get('[data-testid="primary-document-file"]').attachFile(
        '../../helpers/file/sample.pdf',
      );
      cy.get('[data-testid="upload-file-success"]').should('exist');
      cy.get('[data-testid="save-uploaded-pdf-button"]').click();
      cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
      selectTypeaheadInput(
        'court-issued-document-type-search',
        'Summary Opinion',
      );
      cy.get('[data-testid="judge-select"]').select('Ashford');
      cy.get('[data-testid="serve-to-parties-btn"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="print-paper-service-done-button"]').click();

      /** Act */
      cy.get('[data-testid="search-link"]').click();
      cy.get('[data-testid="opinion-search-tab"]').click();
      cy.get('[data-testid="keyword-search-input"]').type(opinionTitle);
      // need to wait for elasticsearch potentially
      retry(() => {
        cy.get('[data-testid="advanced-search-button"]').click();
        cy.get('.search-results').should('exist');
        return cy.get('body').then(body => {
          /** Assert */
          return (
            body.find(`[data-testid="docket-number-link-${docketNumber}"]`)
              .length > 0
          );
        });
      });
    });
  });
});
