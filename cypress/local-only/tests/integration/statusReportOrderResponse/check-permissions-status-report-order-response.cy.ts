import {
  docketNumber,
  messages,
  statusReportDocketEntryId,
} from '../../../support/statusReportOrderResponse';
import { loginAsDocketClerk } from '../../../../helpers/authentication/login-as-helpers';

describe('check permissions for status report order response', () => {
  beforeEach(() => {
    loginAsDocketClerk();
  });

  it('docket clerk should not be able to create status report order response', () => {
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('#tab-document-view').click();
    cy.contains('Status Report').click();

    cy.get('[data-testid="order-response-button"]').should('not.exist');
  });

  it('should not be able to edit a status report order response in the status report order response form', () => {
    cy.visit(`/case-detail/${docketNumber}`);
    cy.get('#tab-drafts').click();
    cy.contains('button', messages.testOrderResponseUnsigned.name).click();
    cy.get('#draft-edit-button-not-signed').click();

    cy.get('[data-testid="save-order-button"]').should('exist');
  });

  it('docket clerk should not be able to view status report order response route', () => {
    [
      `/case-detail/${docketNumber}/documents/${statusReportDocketEntryId}/order-response-create?statusReportFilingDate=2024-06-28&statusReportIndex=5`,
      `/case-detail/${docketNumber}/documents/${statusReportDocketEntryId}/order-response-edit`,
      `/messages/${docketNumber}/message-detail/${messages.statusReport.messageId}/${statusReportDocketEntryId}/order-response-create?statusReportFilingDate=2024-06-28&statusReportIndex=5`,
      `/messages/${docketNumber}/message-detail/${messages.statusReport.messageId}/${statusReportDocketEntryId}/order-response-create`,
    ].forEach((route: string) => {
      cy.visit(route);
      cy.contains('Error 404').should('exist');
    });
  });
});
