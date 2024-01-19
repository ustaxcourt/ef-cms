import { createPaperPetition } from '../support/pages/create-paper-petition';
import { searchByDocketNumberInHeader } from '../../helpers/search-by-docket-number-in-header';

import { createAndServePaperPetition } from '../../helpers/create-and-serve-paper-petition';
import { unchecksOrdersAndNoticesBoxesInCase } from '../support/pages/unchecks-orders-and-notices-boxes-in-case';

describe('Create case and submit to IRS', function () {
  describe('Cancel a case', () => {
    it('should create a paper petition', () => {
      createPaperPetition();
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

    it('should display a confirmation modal when the user clicks cancel on the review page', () => {
      cy.get('button#cancel-create-case').scrollIntoView().click();
      cy.get('div.modal-header').should('exist');
    });

    it('should route to Document QC inbox when the user confirms to cancel', () => {
      cy.get('button.modal-button-confirm').scrollIntoView().click();
      cy.url().should('include', 'document-qc/my/inbox');
    });
  });
  describe('Save case for later', () => {
    it('should display the docket record correctly when saving a case for later', () => {
      createPaperPetition().then(({ docketNumber }) => {
        cy.get('[data-testid="save-case-for-later"]').click();
        cy.get('[data-testid="success-alert"]').should('exist');
        searchByDocketNumberInHeader(docketNumber);
        cy.get('[data-testid="document-viewer-link-ATP"]').should('be.visible');
        // cy.get(
        //   '[data-testid="798b2a30-268e-42a2-b476-f97fa90b3201"] > :nth-child(3)',
        // ).should('be.visible');
        // cy.get(
        //   '[data-testid="798b2a30-268e-42a2-b476-f97fa90b3201"] > :nth-child(9) > .text-semibold',
        // ).should('be.visible');
        // cy.get(
        //   '[data-testid="798b2a30-268e-42a2-b476-f97fa90b3201"] > :nth-child(9) > .text-semibold',
        // ).should('have.text', 'Not served');
      });
    });
  });

  describe('Submit case to the IRS', () => {
    it('should display the docket record correctly when submitting a case to the IRS', () => {
      createAndServePaperPetition().then(({ docketNumber }) => {
        searchByDocketNumberInHeader(docketNumber);
        cy.get('[data-testid="document-viewer-link-ATP"]').should('be.visible');
      });
    });
  });
});
