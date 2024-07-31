import {
  docketNumber,
  messages,
  statusReportDocketEntryId,
} from '../../../support/statusReportOrder';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('check permissions for status report order', () => {
  beforeEach(() => {
    loginAsDocketClerk();
  });

  it('docket clerk should not be able to create status report order', () => {
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('#tab-document-view').click();
    cy.get(`[data-entry-id="${statusReportDocketEntryId}"]`).click();

    cy.get('[data-testid="order-button"]').should('not.exist');
  });

  it('docket clerk should not be able to edit a status report order in the status report order form', () => {
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('#tab-drafts').click();
    cy.contains('button', messages.testStatusReportOrderUnsigned.name).click();

    cy.get('#draft-edit-button-not-signed').should('not.exist');
  });

  it('docket clerk should not be able to view status report order route', () => {
    [
      `/case-detail/${docketNumber}/documents/${statusReportDocketEntryId}/status-report-order-create?statusReportFilingDate=2024-06-28&statusReportIndex=5`,
      `/case-detail/${docketNumber}/documents/${statusReportDocketEntryId}/status-report-order-edit`,
      `/messages/${docketNumber}/message-detail/${messages.statusReport.messageId}/${statusReportDocketEntryId}/status-report-order-create?statusReportFilingDate=2024-06-28&statusReportIndex=5`,
      `/messages/${docketNumber}/message-detail/${messages.statusReport.messageId}/${statusReportDocketEntryId}/status-report-order-create`,
    ].forEach((route: string) => {
      cy.visit(route);
      cy.contains('Error 404').should('exist');
    });
  });
});
