import { createAPractitioner } from 'cypress/helpers/accountCreation/create-a-practitioner';
import { loginAsAdmissionsClerk } from 'cypress/helpers/authentication/login-as-helpers';
import { attachFile } from 'cypress/helpers/file/upload-file';

describe('Admissions Clerk - Practitioner Documents', () => {
  it('searches by bar number, adds a practitioner document without description, and sees it in the table', () => {
    loginAsAdmissionsClerk();
    createAPractitioner().then(({ barNumber }) => {
      cy.get('[data-testid="search-link"]').click();
      cy.get('[data-testid="practitioner-search-tab"]').click();

      cy.get('[data-testid="bar-number-search-input"]').type(barNumber);
      cy.get('[data-testid="practitioner-search-by-bar-number-button"]').click();

      cy.url().should('include', `/practitioner-detail/${barNumber}`);

      cy.get('#tabButton-practitionerDocumentation').click();
      cy.get('[data-testid="add-practitioner-document-button"]').should('exist');

      cy.get('[data-testid="add-practitioner-document-button"]').click();
      cy.get('[data-testid="add-edit-practitioner-document-header"]').should('exist');

      attachFile({
        filePath: '../../helpers/file/sample.pdf',
        selector: 'input#practitioner-document-file',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });
      cy.get('#category-type').select('Application');

      cy.contains('button', 'Add File').click();

      cy.url().should('include', `?tab=practitioner-documentation`);
      cy.get('table').within(() => {
        cy.contains('.file-name-button', 'sample.pdf').should('exist');
        cy.contains('td', 'Application').should('exist');
      });

      const descriptionText = 'Uploaded via Cypress: description added';
      cy.contains('tr', 'sample.pdf').within(() => {
        cy.contains('Edit').click();
      });

      cy.get('[data-testid="add-edit-practitioner-document-header"]').should('exist');
      cy.get('#documentation-notes').clear();
      cy.get('#documentation-notes').type(descriptionText);
      cy.contains('button', 'Update File').click();

      cy.url().should('include', `?tab=practitioner-documentation`);
      cy.contains('tr', 'sample.pdf').within(() => {
        cy.get('td.file-description').should('contain.text', descriptionText);
        cy.get('td.categoryName').should('contain.text', 'Application');
      });
    });
  });
});


