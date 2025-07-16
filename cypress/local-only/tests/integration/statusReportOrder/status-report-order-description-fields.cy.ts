import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';
import {
  docketNumber,
  getLastDraftOrderElementFromDrafts,
} from '../../../support/statusReportOrder';
import {
  loginAsColvin,
  loginAsColvinChambers,
  loginAsDocketClerk,
} from '../../../../helpers/authentication/login-as-helpers';
import { logout } from '../../../../helpers/authentication/logout';

describe('should default status report order descriptions', () => {
  const today = formatNow(FORMATS.MMDDYYYY);
  it('should display default description when document type is an Order', () => {
    judgeOrChambersCreatesStatusReportOrder(today);
    loginAsDocketClerk();
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('#tab-drafts').click();
    getLastDraftOrderElementFromDrafts().click();
    cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
    cy.get('[data-testid="court-issued-document-type-search"]').should(
      'have.text',
      'Order',
    );
    cy.get('[data-testid="document-description-input"]').should(
      'have.value',
      `Order parties by ${today} shall file a status report.`,
    );
    cy.get('[data-testid="docket-entry-preview-text"]').should(
      'have.text',
      `Docket entry preview: Order parties by ${today} shall file a status report.`,
    );
  });

  it('should set event code to OJR when case is stricken from trial session and jurisdiction is retained and display default description', () => {
    judgeOrChambersCreatesStatusReportOrder(today, true);
    loginAsDocketClerk();
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('#tab-drafts').click();
    getLastDraftOrderElementFromDrafts().click();
    cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
    cy.get('[data-testid="court-issued-document-type-search"]').should(
      'have.text',
      'Order that jurisdiction is retained',
    );
    cy.get('[data-testid="document-description-input"]').should(
      'have.value',
      `. Parties by ${today} shall file a status report. Case is stricken from the current trial session.`,
    );
    cy.get('[data-testid="judge-select"]').should('have.value', 'Colvin');
    cy.get('[data-testid="docket-entry-preview-text"]').should(
      'have.text',
      `Docket entry preview: Order that jurisdiction is retained by Judge Colvin. Parties by ${today} shall file a status report. Case is stricken from the current trial session.`,
    );
  });

  it('should continue to handle OJR and set correct signing judge when status order report is signed by chambers user', () => {
    judgeOrChambersCreatesStatusReportOrder(today, true, true);
    loginAsDocketClerk();
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('#tab-drafts').click();
    getLastDraftOrderElementFromDrafts().click();
    cy.get('[data-testid="add-court-issued-docket-entry-button"]').click();
    cy.get('[data-testid="court-issued-document-type-search"]').should(
      'have.text',
      'Order that jurisdiction is retained',
    );
    cy.get('[data-testid="document-description-input"]').should(
      'have.value',
      `. Parties by ${today} shall file a status report. Case is stricken from the current trial session.`,
    );
    cy.get('[data-testid="judge-select"]').should('have.value', 'Colvin');
    cy.get('[data-testid="docket-entry-preview-text"]').should(
      'have.text',
      `Docket entry preview: Order that jurisdiction is retained by Judge Colvin. Parties by ${today} shall file a status report. Case is stricken from the current trial session.`,
    );
  });
});

function judgeOrChambersCreatesStatusReportOrder(
  today: string,
  jurisdictionRetained: boolean = false,
  chambersUser: boolean = false,
) {
  if (chambersUser) {
    loginAsColvinChambers();
  } else {
    loginAsColvin();
  }
  cy.visit(`/case-detail/${docketNumber}`);
  cy.get('#tab-document-view').click();
  cy.contains('Status Report').click();
  cy.get('[data-testid="status-report-order-button"]').click();
  cy.get('[data-testid="order-type-status-report"]').check({ force: true });
  cy.get('#status-report-due-date-picker').type(today);

  if (jurisdictionRetained) {
    cy.get('#stricken-from-trial-sessions-label').click();
    cy.get(
      '#jurisdiction-form-group > :nth-child(2) > .usa-radio__label',
    ).click();
    cy.get('#jurisdiction-retained').check();
  }
  cy.get('[data-testid="save-draft-button"]').click();
  cy.get('[data-testid="sign-pdf-canvas"]').click();
  cy.get('[data-testid="save-signature-button"]').click();
  logout();
}
