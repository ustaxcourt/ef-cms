import { loginAsDocketClerk } from '../../helpers/auth/login-as-helpers';

describe('Docket clerk creates a draft order with selected docket numbers', function () {
  const leadCase = '111-19';
  let draftsCount: number;

  it('should create an order with selected cases', () => {
    loginAsDocketClerk();
    cy.get('[data-testid="docket-number-search-input"]').clear();
    cy.get('[data-testid="docket-number-search-input"]').type(
      `${leadCase}{enter}`,
    );

    cy.get('[data-testid="icon-tab-unread-messages-count"]')
      .invoke('text')
      .then(text => {
        draftsCount = Number(text);
      });

    cy.get('[data-testid="search-docket-number"]').click();
    cy.get('[data-testid="case-detail-menu-button"] > .svg-inline--fa').click();
    cy.get('[data-testid="menu-button-create-order"]').click();
    cy.get('[data-testid="event-code-select"]').select('O');
    cy.get('[data-testid="create-order-document-title"]').clear();
    cy.get('[data-testid="create-order-document-title"]').type(
      'Order first title',
    );
    cy.get('[data-testid="modal-button-confirm"]').click();
    cy.get('[data-testid="create-order-page-title"]').should(
      'have.text',
      'Create Order first title Edit Title',
    );
    cy.get('[data-testid="create-order-page-title"] > .margin-left-1').click();
    cy.get('[data-testid="edit-order-document-title"]').click();
    cy.get('[data-testid="edit-order-document-title"]').clear();
    cy.get('[data-testid="edit-order-document-title"]').type(
      'Order edited title',
    );
    cy.get('[data-testid="modal-button-confirm"]').click();
    cy.get('[data-testid="create-order-page-title"]').should(
      'have.text',
      'Create Order edited title Edit Title',
    );
    cy.get('[data-testid="add-docket-number-btn"]').should(
      'have.text',
      'Add docket numbers to the caption',
    );
    cy.get('[data-testid="add-docket-number-btn"] > .svg-inline--fa').should(
      'have.class',
      'fa-plus-circle',
    );
    cy.get('[data-testid="add-docket-number-btn"]').click();
    cy.get('[data-testid="modal-button-confirm"]').click();
    cy.get('[data-testid="add-docket-number-btn"]').should(
      'have.text',
      'Edit docket numbers in the caption',
    );
    cy.get('[data-testid="add-docket-number-btn"] > .svg-inline--fa').should(
      'have.class',
      'fa-edit',
    );
    cy.get('.ql-editor').click();
    cy.get('[data-testid="save-order-button"]').click();
    cy.get('[data-testid="sign-pdf-canvas"]').click();
    cy.get('[data-testid="save-signature-button"]').click();
    cy.get('.usa-alert__text').should(
      'have.text',
      'Order edited title updated.',
    );
    cy.get('[data-testid="icon-tab-unread-messages-count"]')
      .invoke('text')
      .then(val => {
        const draftCountAfter = Number(val);
        expect(draftCountAfter).to.equal(draftsCount + 1);
      });
  });
});
