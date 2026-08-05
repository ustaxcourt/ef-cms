import {
  loginAsCaseServicesSupervisor,
  loginAsColvin,
} from 'cypress/helpers/authentication/login-as-helpers';
import { createAndServePaperFiling } from 'cypress/helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { createAndServeConsolidatedGroup } from 'cypress/helpers/fileAPetition/create-consolidated-case-group';
import {
  grantDenyMotionToday,
  GRANT_DENY_MOTION_TYPE,
  openGrantDenyMotionFromDocketRecord,
} from 'cypress/helpers/grantDenyMotion/grant-deny-motion-helpers';

describe('Grant/Deny Motion consolidated lead case (T13537, T13540)', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should default to all cases in group on a consolidated lead case (T13537)', () => {
    createAndServeConsolidatedGroup({ numberOfMemberCases: 1 }).then(
      ({ leadDocketNumber }) => {
        loginAsCaseServicesSupervisor();
        cy.visit(`/case-detail/${leadDocketNumber}`);
        createAndServePaperFiling({
          dateReceived: grantDenyMotionToday,
          documentType: GRANT_DENY_MOTION_TYPE,
        });

        loginAsColvin();
        cy.visit(`/case-detail/${leadDocketNumber}`);
        openGrantDenyMotionFromDocketRecord();

        cy.get('#issue-order-all-cases').should('be.checked');
        cy.get('[data-testid="motion-disposition-GRANTED"]').click({
          force: true,
        });

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );
        cy.get('[data-testid="preview-pdf-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request }) => {
          const html: string = request.body.contentHtml;
          expect(html).to.include('lead case doc. no.');
          expect(html).to.include("petitioner's");
          expect(html).not.to.include("petitioners'");
        });
      },
    );
  });

  it('should issue order for just this case on a consolidated lead case (T13540)', () => {
    createAndServeConsolidatedGroup({ numberOfMemberCases: 1 }).then(
      ({ leadDocketNumber }) => {
        loginAsCaseServicesSupervisor();
        cy.visit(`/case-detail/${leadDocketNumber}`);
        createAndServePaperFiling({
          dateReceived: grantDenyMotionToday,
          documentType: GRANT_DENY_MOTION_TYPE,
        });

        loginAsColvin();
        cy.visit(`/case-detail/${leadDocketNumber}`);
        openGrantDenyMotionFromDocketRecord();

        cy.get('#issue-order-just-this-case').click({ force: true });
        cy.get('#issue-order-just-this-case').should('be.checked');

        cy.get('[data-testid="motion-disposition-GRANTED"]').click({
          force: true,
        });
        cy.get('[data-testid="due-date-message-stip"]').click({ force: true });
        cy.get('[data-testid="filing-party"]').select('Joint');
        cy.get(
          '.usa-date-picker__external-input[data-testid="grant-deny-due-date-picker"]',
        ).type(grantDenyMotionToday);

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );
        cy.get('[data-testid="preview-pdf-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request }) => {
          const html: string = request.body.contentHtml;
          expect(html).to.include('(doc. no.');
          expect(html).not.to.include('lead case doc. no.');
          expect(html).to.include(
            'ORDERED that the parties shall file a joint status report or proposed stipulated decision',
          );
        });
      },
    );
  });
});
