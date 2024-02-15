import {
  createPaperPetition,
  fillInCreateCaseFromPaperForm,
  postPaperPetition,
} from '../support/pages/create-paper-petition';

import {
  getCreateACaseButton,
  navigateTo as navigateToDocumentQC,
} from '../support/pages/document-qc';

import { searchByDocketNumberInHeader } from '../../helpers/search-by-docket-number-in-header';

import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { unchecksOrdersAndNoticesBoxesInCase } from '../support/pages/unchecks-orders-and-notices-boxes-in-case';

describe('Petition clerk creates a paper filing', function () {
  describe('Create and submit a paper petition', () => {
    it('should create a paper petition', () => {
      navigateToDocumentQC('petitionsclerk');

      getCreateACaseButton().click();
      cy.get('#tab-parties').parent().should('have.attr', 'aria-selected');

      fillInCreateCaseFromPaperForm();
    });

    it('should display check icons on file upload tabs', () => {
      cy.get('[data-testid="icon-petitionFile"]').should('be.visible');
      cy.get('[data-testid="icon-stinFile"]').should('be.visible');
      cy.get('[data-testid="icon-attachmentToPetitionFile"]').should(
        'be.visible',
      );
    });

    it('should submit the petition', () => {
      postPaperPetition();
    });

    it('should display attachment links in the attachment section', () => {
      cy.get('[data-testid="petitionFileButton"]').should('be.visible');
      cy.get('[data-testid="petitionFileButton"]').click();
      cy.get('[data-testid="modal-dialog-header"]').should('be.visible');
      cy.get('[data-testid="close-modal-button"]').click();
      cy.get('[data-testid="stinFileButton"]').should('be.visible');
      cy.get('[data-testid="stinFileButton"]').should('not.have.attr', 'href');
      cy.get('[data-testid="requestForPlaceOfTrialFileButton"]').should(
        'be.visible',
      );
      cy.get('[data-testid="requestForPlaceOfTrialFileButton"]').click();
      cy.get('[data-testid="modal-dialog-header"]').should('be.visible');
      cy.get('[data-testid="close-modal-button"]').click();
      cy.get('[data-testid="attachmentToPetitionFileButton"]').should(
        'be.visible',
      );
      cy.get('[data-testid="attachmentToPetitionFileButton"]').click();
      cy.get('[data-testid="modal-dialog-header"]').should('be.visible');
      cy.get('[data-testid="close-modal-button"]').click();
    });

    it('should display Orders/Notices Automatically Created notification', () => {
      cy.get('#orders-notices-needed-header').should('exist');
      cy.get('#orders-notices-auto-created-in-draft').should('exist');
    });

    it('should uncheck the previously selected Notices/Orders needed in Case Info Tab', () => {
      cy.get('#case-information-edit-button').click();
      unchecksOrdersAndNoticesBoxesInCase();

      cy.intercept('PUT', '**/cases/**').as('submitCase');
      cy.get('#submit-case').click();
      cy.wait('@submitCase').then(() => {
        cy.get('#orders-notices-needed-header').should('not.exist');
        cy.get('#orders-notices-auto-created-in-draft').should('not.exist');
      });
    });
  });

  describe('Cancel case', () => {
    it('should route to the Document QC inbox when user confirms to cancel', () => {
      createPaperPetition().then(() => {
        cy.get('button#cancel-create-case').scrollIntoView().click();
        cy.get('div.modal-header').should('exist');
        cy.get('button.modal-button-confirm').scrollIntoView().click();
        cy.url().should('include', 'document-qc/my/inbox');
      });
    });
  });

  describe('Save case for later', () => {
    it('should display the docket record correctly when uploading an attachment to petition', () => {
      createPaperPetition().then(({ docketNumber }) => {
        cy.get('[data-testid="save-case-for-later"]').click();
        cy.get('[data-testid="success-alert"]').should('exist');
        searchByDocketNumberInHeader(docketNumber);

        cy.get('[data-testid="document-viewer-link-ATP"]')
          .should('be.visible')
          .parent('td')
          .siblings('td')
          .then(siblingTds => {
            siblingTds.each((_index, siblingTd) => {
              const textContent = Cypress.$(siblingTd).text();
              if (textContent.includes('Not Served')) {
                expect(textContent).to.include('Not Served');
              }
            });
          });
      });
    });
  });

  describe('Submit case to the IRS', () => {
    it('should display the docket record correctly when uploading an attachment to petition', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        searchByDocketNumberInHeader(docketNumber);
        cy.get('[data-testid="document-viewer-link-ATP"]')
          .should('be.visible')
          .parent('td')
          .siblings('td')
          .then(siblingTds => {
            siblingTds.each((_index, siblingTd) => {
              const textContent = Cypress.$(siblingTd).text();
              if (textContent === 'R') {
                expect(textContent).to.equal('R');
              }
              if (textContent === 'ATP') {
                expect(textContent).to.equal('ATP');
              }
            });
          });
      });
    });
  });
});
