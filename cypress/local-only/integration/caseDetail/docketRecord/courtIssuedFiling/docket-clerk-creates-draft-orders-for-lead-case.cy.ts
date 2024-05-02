import { createOrder } from '../../../../../helpers/caseDetail/docketRecord/courtIssuedFiling/create-order';
import { goToCase } from '../../../../../helpers/caseDetail/go-to-case';
import { loginAsDocketClerk1 } from '../../../../../helpers/authentication/login-as-helpers';

describe('Docket clerk creates and edits draft order with selected docket numbers', function () {
  it('should create an order with ALL cases selected', () => {
    let consolidatedCases = '';
    let draftsCount = 0;
    const leadCase = '111-19';

    loginAsDocketClerk1();
    goToCase(leadCase);

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

    createOrder();

    cy.get('[data-testid="icon-tab-unread-messages-count"]')
      .invoke('text')
      .then(val => {
        const draftCountAfter = Number(val);
        expect(draftCountAfter).to.equal(draftsCount + 1);
      });

    cy.get('[data-testid="success-alert"]')
      .invoke('attr', 'data-metadata')
      .then(val => {
        expect(val).to.equal(consolidatedCases);
      });
  });

  it('should edit the draft order with newly selected cases', () => {
    let draftsCount = 0;
    const leadCase = '111-19';
    const expectedDocketNumberSelected = `${leadCase}L`;

    loginAsDocketClerk1();
    goToCase(leadCase);
    createOrder();

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

    cy.get('[data-testid="success-alert"]')
      .invoke('attr', 'data-metadata')
      .then(val => {
        expect(val).to.equal(expectedDocketNumberSelected);
      });
  });
});
