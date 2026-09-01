import {
  loginAsCaseServicesSupervisor,
  loginAsColvin,
  loginAsPetitionsClerk1,
} from 'cypress/helpers/authentication/login-as-helpers';
import { createAndServePaperFiling } from 'cypress/helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import {
  grantDenyMotionToday,
  GRANT_DENY_MOTION_TYPE,
  openGrantDenyMotionFromDocketRecord,
} from 'cypress/helpers/grantDenyMotion/grant-deny-motion-helpers';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';

describe('Grant/Deny Motion hearing scenarios (T13541, T13542)', () => {
  beforeEach(() => {
    Cypress.session.clearCurrentSessionData();
  });

  it('should use trial session date in preamble when case is calendared and has a hearing (T13541)', () => {
    loginAsPetitionsClerk1();
    createTrialSession().then(({ trialSessionId: primaryTrialSessionId }) => {
      cy.get('[data-testid="new-trial-sessions-tab"]').click();
      cy.get(
        `[data-testid="trial-location-link-${primaryTrialSessionId}"]`,
      ).click();
      cy.get('[data-testid="set-calendar-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      createTrialSession().then(({ trialSessionId: hearingTrialSessionId }) => {
        cy.get('[data-testid="new-trial-sessions-tab"]').click();
        cy.get(
          `[data-testid="trial-location-link-${hearingTrialSessionId}"]`,
        ).click();
        cy.get('[data-testid="set-calendar-button"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();

        createAndServePaperPetition({ yearReceived: '2025' }).then(
          ({ docketNumber }) => {
            loginAsCaseServicesSupervisor();
            cy.visit(`/case-detail/${docketNumber}`);
            createAndServePaperFiling({
              dateReceived: grantDenyMotionToday,
              documentType: GRANT_DENY_MOTION_TYPE,
            });

            cy.get('[data-testid="tab-case-information"]').click();
            cy.get('[data-testid="add-to-trial-session-btn"]').click();
            cy.get('[data-testid="all-locations-option"]').click();
            cy.get('[data-testid="trial-session-select"]').select(
              primaryTrialSessionId,
            );
            cy.get('[data-testid="modal-button-confirm"]').click();

            cy.get('[data-testid="set-for-hearing-button"]').click();
            cy.get('[data-testid="all-locations-option"]').click();
            cy.get('[data-testid="trial-session-select"]').select(
              hearingTrialSessionId,
            );
            cy.get('[data-testid="modal-button-confirm"]').click();

            loginAsColvin();
            cy.visit(`/case-detail/${docketNumber}`);
            openGrantDenyMotionFromDocketRecord();

            cy.get('[data-testid="motion-disposition-GRANTED"]').click({
              force: true,
            });

            cy.intercept('POST', '**/api/court-issued-order').as(
              'courtIssuedOrder',
            );
            cy.get('[data-testid="preview-pdf-button"]').click();

            cy.wait('@courtIssuedOrder').then(({ request }) => {
              const html: string = request.body.contentHtml;
              expect(html).to.include(
                'This case is set for trial at the session of the Court commencing on',
              );
            });
          },
        );
      });
    });
  });

  it('should disable stricken when case has a hearing but is not calendared (T13542)', () => {
    loginAsPetitionsClerk1();
    createTrialSession().then(({ trialSessionId: hearingTrialSessionId }) => {
      cy.get('[data-testid="new-trial-sessions-tab"]').click();
      cy.get(
        `[data-testid="trial-location-link-${hearingTrialSessionId}"]`,
      ).click();
      cy.get('[data-testid="set-calendar-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();

      createAndServePaperPetition({ yearReceived: '2025' }).then(
        ({ docketNumber }) => {
          loginAsCaseServicesSupervisor();
          cy.visit(`/case-detail/${docketNumber}`);
          createAndServePaperFiling({
            dateReceived: grantDenyMotionToday,
            documentType: GRANT_DENY_MOTION_TYPE,
          });

          cy.get('[data-testid="tab-case-information"]').click();
          cy.get('[data-testid="set-for-hearing-button"]').click();
          cy.get('[data-testid="all-locations-option"]').click();
          cy.get('[data-testid="trial-session-select"]').select(
            hearingTrialSessionId,
          );
          cy.get('[data-testid="modal-button-confirm"]').click();

          loginAsColvin();
          cy.visit(`/case-detail/${docketNumber}`);
          openGrantDenyMotionFromDocketRecord();

          cy.get('[data-testid="stricken-from-trial-session"]').should(
            'be.disabled',
          );
          cy.get('[data-testid="jurisdiction-restored"]').should('be.disabled');
          cy.get('[data-testid="jurisdiction-retained"]').should('be.disabled');
        },
      );
    });
  });
});
