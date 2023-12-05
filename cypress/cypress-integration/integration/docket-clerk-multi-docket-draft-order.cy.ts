import { loginAsDocketClerk } from '../../helpers/auth/login-as-helpers';

describe('Docket clerk creates a draft order with selected docket numbers', function () {
  const leadCase = '111-19';
  const orderTitle = 'Order first title';
  const orderEventCode = 'O';
  const editedOrderTitle = 'Order edited title';

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
        // default count to 0 if there are no drafts
        draftsCount = !text ? 0 : Number(text);
      });

    cy.get('[data-testid="search-docket-number"]').click();
    cy.get('[data-testid="case-detail-menu-button"] > .svg-inline--fa').click();
    cy.get('[data-testid="menu-button-create-order"]').click();
    cy.get('[data-testid="event-code-select"]').select(orderEventCode);
    cy.get('[data-testid="create-order-document-title"]').clear();
    cy.get('[data-testid="create-order-document-title"]').type(orderTitle);
    cy.get('[data-testid="modal-button-confirm"]')
      .invoke('click')
      .then(() => {
        cy.visit(
          `case-detail/${leadCase}/create-order?documentTitle=${orderTitle}&documentType=Order&eventCode=${orderEventCode}`,
        );
      });

    cy.get('[data-testid="create-order-page-title"]').should(
      'contain',
      `Create ${orderTitle}`,
    );
    cy.get('[data-testid="create-order-page-title"] > .margin-left-1').click();
    cy.get('[data-testid="edit-order-document-title"]').click();
    cy.get('[data-testid="edit-order-document-title"]').clear();
    cy.get('[data-testid="edit-order-document-title"]').type(editedOrderTitle);
    cy.get('[data-testid="modal-button-confirm"]').click();
    cy.get('[data-testid="create-order-page-title"]').should(
      'contain',
      `Create ${editedOrderTitle}`,
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
