import { loginAsDocketClerk } from '../../helpers/auth/login-as-helpers';

describe('Docket clerk creates and edits draft order with selected docket numbers', function () {
  const leadCase = '111-19';

  beforeEach(() => {
    loginAsDocketClerk();
  });

  it('should create an order with ALL cases selected', () => {
    const orderTitle = 'Order first title';
    const orderEventCode = 'O';
    let consolidatedCases: string = '';
    let draftsCount: number = 0;

    cy.get('[data-testid="docket-number-search-input"]').clear();
    cy.get('[data-testid="docket-number-search-input"]').type(
      `${leadCase}{enter}`,
    );

    cy.get('[data-testid^="consolidatedCasesOfLeadCase-"]')
      .invoke('attr', 'data-testid')
      .then(text => {
        consolidatedCases = text!.replace(/consolidatedCasesOfLeadCase-/g, '');
      });

    cy.get('[data-testid="icon-tab-unread-messages-count"]')
      .invoke('text')
      .then(text => {
        draftsCount = Number(text) || draftsCount;
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

    cy.get('[data-testid="skip-signature-button"]').click();
    cy.get('.usa-alert__text').should('have.text', `${orderTitle} updated.`);
    cy.get('[data-testid="icon-tab-unread-messages-count"]')
      .invoke('text')
      .then(val => {
        const draftCountAfter = Number(val);
        expect(draftCountAfter).to.equal(draftsCount + 1);
      });

    //extract into its own assert helper.
    cy.get('[data-testid="success-alert"]')
      .invoke('attr', 'data-metadata')
      .then(val => {
        expect(val).to.equal(consolidatedCases);
      });
  });

  it('should edit the draft order with newly selected cases', () => {
    let draftsCount: number = 0;

    loginAsDocketClerk();
    cy.get('[data-testid="docket-number-search-input"]').clear();
    cy.get('[data-testid="docket-number-search-input"]').type(
      `${leadCase}{enter}`,
    );

    cy.get('[data-testid="icon-tab-unread-messages-count"]')
      .invoke('text')
      .then(text => {
        draftsCount = Number(text) || draftsCount;

        cy.get('[data-testid="icon-tab-unread-messages-count"]').click();
        cy.get(
          `[data-testid="docket-entry-description-${draftsCount! - 1}"]`,
        ).click();

        cy.get('[data-testid="draft-edit-button-not-signed"]').click();
        cy.get(
          '[data-testid="create-order-page-title"] > .margin-left-1',
        ).click();
        cy.get('[data-testid="edit-order-document-title"]').click();
        cy.get('[data-testid="edit-order-document-title"]').clear();
        cy.get('[data-testid="edit-order-document-title"]').type(
          'Order edited title',
        );
        cy.get('[data-testid="modal-button-confirm"]').click();
        cy.get('[data-testid="create-order-page-title"]').should(
          'have.text',
          'Edit Order edited title Edit Title',
        );
        cy.get('[data-testid="add-docket-number-btn"]').click();
        cy.get('[data-testid="consolidated-case-checkbox-all-label"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();
        cy.get('[data-testid="save-order-button"]').click();
        cy.get('[data-testid="skip-signature-button"]').click();
      });

    //extract into its own assert helper.
    const expectedDocketNumberSelected = `${leadCase}L`;
    cy.get('[data-testid="success-alert"]')
      .invoke('attr', 'data-metadata')
      .then(val => {
        expect(val).to.equal(expectedDocketNumberSelected);
      });
  });
});
