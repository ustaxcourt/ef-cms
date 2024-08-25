import { faker } from '@faker-js/faker';
import { goToCase } from '../../../../../../helpers/caseDetail/go-to-case';
import { loginAsDocketClerk1 } from '../../../../../../helpers/authentication/login-as-helpers';

describe('Docket clerk uploads and edits court-issued docket entries', () => {
  it('should let a docket clerk upload a court-issued docket entry and the edit it while it is unsigned', () => {
    const leadCase = '111-19';

    loginAsDocketClerk1();
    goToCase(leadCase);

    // Arrange: create the docket entry
    cy.get('[data-testid="case-detail-menu-button"]').click();
    cy.get('[data-testid="menu-button-upload-pdf"]').click();
    const title = `${faker.word.adjective()} ${faker.word.noun()}`;
    cy.get('[data-testid="upload-description"]').type(title);
    cy.readFile('cypress/helpers/file/sample.pdf', null).then(fileContent => {
      cy.get('[data-testid="primary-document-file"]').attachFile({
        fileContent,
        fileName: 'sample.pdf',
        mimeType: 'application/pdf',
      });
      cy.get('[data-testid="save-uploaded-pdf-button"]').click();
    });

    // Act: edit the docket entry
    cy.get('[data-testid="tab-drafts"').click();
    cy.get('[data-testid="draft-edit-button-not-signed"]').click();
    const newTitle = `${faker.word.adjective()} ${faker.word.noun()}`;
    cy.get('[data-testid="upload-description"]').clear();
    cy.get('[data-testid="upload-description"]').type(newTitle);
    cy.get('[data-testid="save-edited-pdf-button"]').click();

    // Assert: the new description should display for the edited docket entry
    cy.get('[data-testid^="docket-entry-description-"]').then($els => {
      const matchingElements = $els.filter((index, el) => {
        return Cypress.$(el).text().includes(newTitle);
      });

      expect(
        matchingElements.length,
        `Expected to find "${newTitle}" in at least one element`,
      ).to.be.greaterThan(0);
    });

    // TODO: the above assertion fails because the updated document title does not display in the draft menu
  });

  it('should let a docket clerk upload a court-issued docket entry and the edit it after it is signed', () => {
    const leadCase = '111-19';

    loginAsDocketClerk1();
    goToCase(leadCase);

    cy.get('data-testid=[docket-entry-description-0').click();
    cy.get('data-testid="edit-order-button"').click();
    cy.get('data-testid="modal-button-confirm"').click();
    // TODO: the call to `/remove-signature` on the backend throws a 400 error
  });
});
