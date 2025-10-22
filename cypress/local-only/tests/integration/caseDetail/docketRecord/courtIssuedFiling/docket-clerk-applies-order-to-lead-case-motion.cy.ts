import { createOrderOnConsolidatedCase } from '../../../../../../helpers/caseDetail/docketRecord/courtIssuedFiling/create-order';
import { goToCase } from '../../../../../../helpers/caseDetail/go-to-case';
import { loginAsDocketClerk1 } from '../../../../../../helpers/authentication/login-as-helpers';

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

    createOrderOnConsolidatedCase('Apply order on all subsidiary cases.');

    // Apply signature
    // Add Docket Entry
    cy.get('#apply-signature').click();
    cy.get('[data-testid="sign-pdf-canvas"]').click();
    cy.get('[data-testid="save-signature-button"]').click();
    cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();

    // select dispositionOrder checkbox
    cy.get('[data-testid=')
  });
});
