import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '../../../shared/src/business/entities/EntityConstants';
import { fillInCreateCaseFromPaperForm } from '../support/pages/create-paper-petition';
import {
  getCreateACaseButton,
  navigateTo as navigateToDocumentQC,
} from '../support/pages/document-qc';

const createCaseWithAutoGeneratedNANE = () => {
  navigateToDocumentQC('petitionsclerk');
  getCreateACaseButton().click();
  fillInCreateCaseFromPaperForm();

  cy.intercept('POST', '**/paper').as('postPaperCase');

  cy.get('#submit-case').click();

  cy.wait('@postPaperCase').then(({ response }) => {
    const { docketNumber } = response.body;
    cy.get('#orders-notices-auto-created-in-draft').should('exist');
    cy.get('#submit-case').scrollIntoView();
    cy.get('#submit-case').click();
    cy.get('#confirm').click();
    cy.get('#done-viewing-paper-petition-receipt-button').click();
    cy.visit(`/case-detail/${docketNumber}`);
  });

  cy.get('#tab-drafts').click();
};

describe('Petitions clerk verifies autogenerated NANE after serving a case', () => {
  const orderNoticeTitle =
    SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfAttachmentsInNatureOfEvidence
      .documentTitle;

  describe('Confirm Draft Count', () => {
    it('should check that the Draft count should increase by 1 and the first item in the draft tab is a NANE', () => {
      createCaseWithAutoGeneratedNANE();

      cy.get('.icon-tab-unread-messages-count').should('have.text', '1');
      cy.get('.document-viewer--documents-list')
        .children()
        .should('have.length', 1);
      cy.get('#docket-entry-description-0').should(
        'have.text',
        orderNoticeTitle,
      );
    });

    it('should check that the Draft count is zero after adding the NANE as a docket entry', () => {
      cy.get('a#add-court-issued-docket-entry-button').click();
      cy.get('div.select-react-element__single-value').should(
        'have.text',
        'Notice',
      );
      cy.get('input#free-text').should('have.value', orderNoticeTitle);
      cy.get('button#serve-to-parties-btn').click();
      cy.get('button.modal-button-confirm ').click();
      cy.get('button#print-paper-service-done-button').click();
      cy.get('.icon-tab-unread-messages-count').should('not.exist');
    });
  });

  describe('Confirms rendering of full pdf and deletion of draft item', () => {
    it('should verify full rendering of the draft item as a pdf', () => {
      createCaseWithAutoGeneratedNANE();

      cy.intercept('GET', '**/document-download-url').as('viewFullPdf');
      cy.get('button#view-full-pdf').click();
      cy.wait('@viewFullPdf').then(({ response }) => {
        const { url } = response.body;
        cy.request(url).its('status').should('eq', 200);
      });
    });

    it('should delete the draft item and verify that the Draft count is zero', () => {
      cy.get('button#delete-pdf').click();
      cy.get('button.modal-button-confirm').click();

      cy.get('.icon-tab-unread-messages-count').should('not.exist');
    });
  });
});
