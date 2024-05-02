import { createAndServePaperPetition } from '../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { goToCase } from '../../../helpers/caseDetail/go-to-case';
import { loginAsPetitionsClerk1 } from '../../../helpers/authentication/login-as-helpers';
import { retry } from '../../../helpers/retry';

describe('search page functionality', () => {
  it('should be able to create a case and serve to IRS', () => {
    loginAsPetitionsClerk1();
    createAndServePaperPetition().then(({ docketNumber, name }) => {
      cy.get('[data-testid="search-link"]').click();
      cy.get('[data-testid="petitioner-name"]').clear();
      cy.get('[data-testid="petitioner-name"]').type(name);

      retry(() => {
        cy.get('[data-testid="case-search-by-name"]').click();
        return cy.get('body').then(body => {
          return (
            body.find(`[data-testid="case-result-${docketNumber}"]`).length > 0
          );
        });
      });

      cy.get('[data-testid="clear-search-by-name"]').click();
      cy.get(`[data-testid="case-result-${docketNumber}"]`).should('not.exist');
      cy.get('[data-testid="docket-number"]').clear();
      cy.get('[data-testid="docket-number"]').type(docketNumber);
      cy.get('[data-testid="docket-search-button"]').click();
      cy.url().should('include', `/case-detail/${docketNumber}`);
    });
  });

  it('should be able to search for practitioners by name', () => {
    cy.login('docketclerk1');
    cy.get('[data-testid="inbox-tab-content"]').should('exist');
    cy.get('[data-testid="search-link"]').click();
    cy.get('[data-testid="tab-practitioner"]').click();
    cy.get('[data-testid="practitioner-name"]').clear();
    cy.get('[data-testid="practitioner-name"]').type('test');
    cy.get('[data-testid="practitioner-search-by-name-button"]').click();
    cy.get('[data-testid="practitioner-row-PT1234"]').should('exist');
    cy.get('[data-testid="clear-practitioner-search"]').click();
    cy.get('[data-testid="practitioner-row-PT1234"]').should('not.exist');
    cy.get('[data-testid="bar-number-search-input"]').clear();
    cy.get('[data-testid="bar-number-search-input"]').type('pt1234');
    cy.get('[data-testid="practitioner-search-by-bar-number-button"]').click();
    cy.url().should('include', 'pt1234');
    cy.get('[data-testid="print-practitioner-case-list"]').click();
    cy.get('dialog.modal-screen').should('exist');
    cy.get('h3:contains("Printable Case List")').should('be.visible');
  });

  it('should be able to search for practitioners by bar number', () => {
    cy.login('docketclerk1');
    cy.get('[data-testid="inbox-tab-content"]').should('exist');
    cy.get('[data-testid="search-link"]').click();
    cy.get('[data-testid="tab-practitioner"]').click();
    cy.get('[data-testid="bar-number-search-input"]').clear();
    cy.get('[data-testid="bar-number-search-input"]').type('pt1234');
    cy.get('[data-testid="practitioner-search-by-bar-number-button"]').click();
    cy.url().should('include', 'pt1234');
  });

  it('create an opinion on a case and search for it', () => {
    loginAsPetitionsClerk1();
    createAndServePaperPetition().then(({ docketNumber }) => {
      cy.login('docketclerk1');
      cy.get('[data-testid="inbox-tab-content"]').should('exist');
      goToCase(docketNumber);
      cy.get('[data-testid="case-detail-menu-button"]').click();
      cy.get('[data-testid="menu-button-upload-pdf"]').click();
      cy.get('[data-testid="upload-description"]').clear();
      cy.get('[data-testid="upload-description"]').type('an opinion');
      cy.get('[data-testid="primary-document-file"]').attachFile(
        '../fixtures/w3-dummy.pdf',
      );
      cy.get('[data-testid="upload-file-success"]').should('exist');
      cy.get('[data-testid="save-uploaded-pdf-button"]').click();
      cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
      cy.get(
        '[data-testid="primary-document"] .select-react-element__input',
      ).type('Summary Opinion{enter}');
      cy.get('[data-testid="judge-select"]').select('Ashford');
      cy.get('[data-testid="serve-to-parties-btn"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.get('[data-testid="print-paper-service-done-button"]').click();
      cy.get('[data-testid="search-link"]').click();
      cy.get('[data-testid="tab-opinion"]').click();
      cy.get('[data-testid="keyword-search"]').clear();
      cy.get('[data-testid="keyword-search"]').type('an opinion');
      // need to wait for elasticsearch potentially
      retry(() => {
        cy.get('[data-testid="advanced-search-button"]').click();
        cy.get('.search-results').should('exist');
        return cy.get('body').then(body => {
          return (
            body.find(`[data-testid="docket-number-link-${docketNumber}"]`)
              .length > 0
          );
        });
      });
    });
  });
});
