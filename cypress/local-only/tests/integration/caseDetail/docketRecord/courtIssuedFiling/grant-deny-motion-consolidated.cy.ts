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
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';

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

  it('should verify the preamble on a consolidated lead case that is calendered', () => {
    loginAsCaseServicesSupervisor();
    createTrialSession().then(({ trialSessionId }) => {
      cy.get('[data-testid="new-trial-sessions-tab"]').click();
      cy.contains('Anchorage, Alaska').last().click();
      cy.get('[data-testid="set-calendar-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      createAndServeConsolidatedGroup({ numberOfMemberCases: 1 }).then(
        ({ leadDocketNumber }) => {
          loginAsCaseServicesSupervisor();
          cy.visit(`/case-detail/${leadDocketNumber}`);
          createAndServePaperFiling({
            dateReceived: grantDenyMotionToday,
            documentType: GRANT_DENY_MOTION_TYPE,
          });

          cy.get('[data-testid="tab-case-information"]').click();
          cy.get('[data-testid="add-to-trial-session-btn"]').click();
          cy.get('#show-all-locations-true').click({ force: true });
          cy.get('[data-testid="trial-session-select"]').select(trialSessionId);
          cy.get('[data-testid="modal-button-confirm"]').click();

          cy.visit(`/case-detail/${leadDocketNumber}`);
          createAndServePaperFiling({
            dateReceived: grantDenyMotionToday,
            documentType: GRANT_DENY_MOTION_TYPE,
          });

          loginAsColvin();
          cy.visit(`/case-detail/${leadDocketNumber}`);
          openGrantDenyMotionFromDocketRecord();

          cy.get('#issue-order-all-cases').click({ force: true });
          cy.get('#issue-order-all-cases').should('be.checked');

          cy.get('[data-testid="motion-disposition-GRANTED"]').click({
            force: true,
          });
          cy.get('[data-testid="due-date-message-stip"]').click({
            force: true,
          });
          cy.get('[data-testid="stricken-from-trial-session"]').click({
            force: true,
          });
          cy.get('[data-testid="jurisdiction-restored"]').click({
            force: true,
          });
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
            expect(html).to.include(
              'These consolidated cases are set for trial',
            );
            expect(html).to.include('ORDERED that these cases are stricken');
            expect(html).to.include(
              'ORDERED that these cases are restored to the general docket',
            );
          });
        },
      );
    });
  });
});
