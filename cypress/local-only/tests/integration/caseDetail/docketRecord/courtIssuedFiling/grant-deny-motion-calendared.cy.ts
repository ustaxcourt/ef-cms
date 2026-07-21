import {
  loginAsCaseServicesSupervisor,
  loginAsColvin,
} from 'cypress/helpers/authentication/login-as-helpers';
import { createAndServePaperFiling } from 'cypress/helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import {
  grantDenyMotionToday,
  GRANT_DENY_MOTION_TYPE,
  openGrantDenyMotionFromDocketRecord,
} from 'cypress/helpers/grantDenyMotion/grant-deny-motion-helpers';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';

describe('Grant/Deny Motion calendared case (T13536)', () => {
  it('should allow preview with stricken selected but no jurisdiction, and require jurisdiction on save', () => {
    loginAsCaseServicesSupervisor();
    createTrialSession().then(({ trialSessionId }) => {
      cy.get('[data-testid="new-trial-sessions-tab"]').click();
      cy.contains('Anchorage, Alaska').last().click();
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
          cy.get('#show-all-locations-true').click({ force: true });
          cy.get('[data-testid="trial-session-select"]').select(trialSessionId);
          cy.contains('Add Case').click();
          cy.get('[data-testid="success-alert"]').should('exist');

          loginAsColvin();
          cy.visit(`/case-detail/${docketNumber}`);
          openGrantDenyMotionFromDocketRecord();

          cy.get('[data-testid="stricken-from-trial-session"]').click({
            force: true,
          });

          cy.intercept('POST', '**/api/court-issued-order').as(
            'courtIssuedOrder',
          );
          cy.get('[data-testid="preview-pdf-button"]').click();
          cy.wait('@courtIssuedOrder')
            .its('response.statusCode')
            .should('eq', 200);

          cy.get('[data-testid="motion-disposition-GRANTED"]').click({
            force: true,
          });
          cy.get('[data-testid="save-draft-button"]').click();
          cy.get('[data-testid="error-alert"]').should(
            'contain.text',
            'Jurisdiction is required since case is stricken from the trial session',
          );
        },
      );
    });
  });
});
