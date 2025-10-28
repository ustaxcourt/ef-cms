import {
  CASE_STATUS_TYPES,
  PROCEDURE_TYPES_MAP,
  SESSION_TYPES,
} from '@shared/business/entities/EntityConstants';
import {
  loginAsCaseServicesSupervisor,
  loginAsDocketClerk,
  loginAsPetitionsClerk1,
} from 'cypress/helpers/authentication/login-as-helpers';
import { updateCaseStatus } from 'cypress/helpers/caseDetail/caseInformation/update-case-status';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';

describe('Trial Session Aged Eligible Cases', () => {
  const trialLocation = 'Birmingham, Alabama';
  const mockEligibleCase = {
    entityName: 'EligibleCase',
    caseCaption: 'rick james 1761578048592, Petitioner',
    docketNumber: '1342-20',
    docketNumberSuffix: 'L',
    docketNumberWithSuffix: '1342-20L',
    procedureType: 'Regular',
    caseType: 'CDP (Lien/Levy)',
    qcCompleteForTrial: {},
    isSealed: false,
    isAgedCase: false,
    inConsolidatedGroup: false,
    privatePractitioners: [],
    irsPractitioners: [],
  };

  it('should show aged cases for small trial sessions', () => {
    loginAsPetitionsClerk1();
    createTrialSession({
      sessionType: SESSION_TYPES.small,
      trialLocation,
    }).then(({ trialSessionId }) => {
      createAndServePaperPetition({
        trialLocation,
        procedureType: PROCEDURE_TYPES_MAP.small,
      }).then(({ docketNumber }) => {
        loginAsDocketClerk();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);

        loginAsPetitionsClerk1();
        cy.get('[data-testid="trial-session-link"]').click();
        cy.get('[data-testid="new-trial-sessions-tab"]').click();

        cy.intercept(
          'GET',
          `/trial-sessions/${trialSessionId}/eligible-cases`,
          {
            statusCode: 200,
            body: [
              {
                ...mockEligibleCase,
                docketNumber,
                docketNumberWithSuffix: `${docketNumber}SL`,
                docketNumberSuffix: 'SL',
                procedureType: PROCEDURE_TYPES_MAP.small,
                isAgedCase: true,
              },
            ],
          },
        );
        cy.get(`[data-testid="trial-location-link-${trialSessionId}"]`).click();
        cy.get(`[data-testid="table-row-${docketNumber}"]`).should(
          'have.class',
          'aged-cases',
        );
        cy.get(`[data-testid="case-aged-icon-${docketNumber}"]`).should(
          'have.class',
          'visibility-visible',
        );
        cy.get(`[data-testid="case-aged-icon-${docketNumber}"]`).should(
          'have.attr',
          'title',
          'There has not been activity on this case for the past 12 months.',
        );
      });
    });
  });

  it('should show aged cases for hybrid trial sessions', () => {
    loginAsPetitionsClerk1();
    createTrialSession({
      sessionType: SESSION_TYPES.hybrid,
      trialLocation,
    }).then(({ trialSessionId }) => {
      createAndServePaperPetition({
        trialLocation,
        procedureType: PROCEDURE_TYPES_MAP.small,
      }).then(({ docketNumber }) => {
        loginAsDocketClerk();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);

        loginAsPetitionsClerk1();
        cy.get('[data-testid="trial-session-link"]').click();
        cy.get('[data-testid="new-trial-sessions-tab"]').click();

        cy.intercept(
          'GET',
          `/trial-sessions/${trialSessionId}/eligible-cases`,
          {
            statusCode: 200,
            body: [
              {
                ...mockEligibleCase,
                docketNumber,
                docketNumberWithSuffix: `${docketNumber}SL`,
                docketNumberSuffix: 'SL',
                procedureType: PROCEDURE_TYPES_MAP.small,
                isAgedCase: true,
              },
            ],
          },
        );
        cy.get(`[data-testid="trial-location-link-${trialSessionId}"]`).click();

        cy.get('#hybrid-session-filter').select(PROCEDURE_TYPES_MAP.small);

        cy.get(`[data-testid="table-row-${docketNumber}"]`).should('exist');
        cy.get(`[data-testid="table-row-${docketNumber}"]`).should(
          'have.class',
          'aged-cases',
        );
        cy.get(`[data-testid="case-aged-icon-${docketNumber}"]`).should(
          'have.class',
          'visibility-visible',
        );
        cy.get(`[data-testid="case-aged-icon-${docketNumber}"]`).should(
          'have.attr',
          'title',
          'There has not been activity on this case for the past 12 months.',
        );

        cy.get('#hybrid-session-filter').select(PROCEDURE_TYPES_MAP.regular);

        cy.get(`[data-testid="table-row-${docketNumber}"]`).should('not.exist');
      });

      createAndServePaperPetition({
        trialLocation,
        procedureType: PROCEDURE_TYPES_MAP.regular,
      }).then(({ docketNumber }) => {
        loginAsDocketClerk();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);

        loginAsPetitionsClerk1();
        cy.get('[data-testid="trial-session-link"]').click();
        cy.get('[data-testid="new-trial-sessions-tab"]').click();

        cy.intercept(
          'GET',
          `/trial-sessions/${trialSessionId}/eligible-cases`,
          {
            statusCode: 200,
            body: [
              {
                ...mockEligibleCase,
                docketNumber,
                docketNumberWithSuffix: `${docketNumber}L`,
                docketNumberSuffix: 'L',
                procedureType: PROCEDURE_TYPES_MAP.regular,
                isAgedCase: true,
              },
            ],
          },
        );

        cy.get(`[data-testid="trial-location-link-${trialSessionId}"]`).click();

        cy.get('#hybrid-session-filter').select(PROCEDURE_TYPES_MAP.small);

        cy.get(`[data-testid="table-row-${docketNumber}"]`).should('not.exist');

        cy.get('#hybrid-session-filter').select(PROCEDURE_TYPES_MAP.regular);

        cy.get(`[data-testid="table-row-${docketNumber}"]`).should('exist');
        cy.get(`[data-testid="table-row-${docketNumber}"]`).should(
          'have.class',
          'aged-cases',
        );
        cy.get(`[data-testid="case-aged-icon-${docketNumber}"]`).should(
          'have.class',
          'visibility-visible',
        );
        cy.get(`[data-testid="case-aged-icon-${docketNumber}"]`).should(
          'have.attr',
          'title',
          'There has not been activity on this case for the past 12 months.',
        );
      });
    });
  });

  it('should show aged cases for regular trial sessions', () => {
    loginAsPetitionsClerk1();
    createTrialSession({
      sessionType: SESSION_TYPES.regular,
      trialLocation,
    }).then(({ trialSessionId }) => {
      createAndServePaperPetition({
        trialLocation,
        procedureType: PROCEDURE_TYPES_MAP.regular,
      }).then(({ docketNumber }) => {
        loginAsDocketClerk();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);

        loginAsPetitionsClerk1();
        cy.get('[data-testid="trial-session-link"]').click();
        cy.get('[data-testid="new-trial-sessions-tab"]').click();

        cy.intercept(
          'GET',
          `/trial-sessions/${trialSessionId}/eligible-cases`,
          {
            statusCode: 200,
            body: [
              {
                ...mockEligibleCase,
                docketNumber,
                docketNumberWithSuffix: `${docketNumber}L`,
                docketNumberSuffix: 'L',
                procedureType: PROCEDURE_TYPES_MAP.regular,
                isAgedCase: true,
              },
            ],
          },
        );

        cy.get(`[data-testid="trial-location-link-${trialSessionId}"]`).click();
        cy.get(`[data-testid="table-row-${docketNumber}"]`).should(
          'have.class',
          'aged-cases',
        );
        cy.get(`[data-testid="case-aged-icon-${docketNumber}"]`).should(
          'have.class',
          'visibility-visible',
        );
        cy.get(`[data-testid="case-aged-icon-${docketNumber}"]`).should(
          'have.attr',
          'title',
          'There has not been activity on this case for the past 12 months.',
        );
      });
    });
  });

  it('should show aged cases for swing trial sessions', () => {
    loginAsPetitionsClerk1();
    createTrialSession({
      sessionType: SESSION_TYPES.regular,
      trialLocation,
    }).then(({ trialSessionId }) => {
      createTrialSession({
        sessionType: SESSION_TYPES.regular,
        trialLocation,
        associatedSwingTrialSessionId: trialSessionId,
      }).then(({ trialSessionId }) => {
        createAndServePaperPetition({
          trialLocation,
          procedureType: PROCEDURE_TYPES_MAP.regular,
        }).then(({ docketNumber }) => {
          loginAsDocketClerk();
          goToCase(docketNumber);
          updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);

          loginAsPetitionsClerk1();
          cy.get('[data-testid="trial-session-link"]').click();
          cy.get('[data-testid="new-trial-sessions-tab"]').click();

          cy.intercept(
            'GET',
            `/trial-sessions/${trialSessionId}/eligible-cases`,
            {
              statusCode: 200,
              body: [
                {
                  ...mockEligibleCase,
                  docketNumber,
                  docketNumberWithSuffix: `${docketNumber}L`,
                  docketNumberSuffix: 'L',
                  procedureType: PROCEDURE_TYPES_MAP.regular,
                  isAgedCase: true,
                },
              ],
            },
          );

          cy.get(
            `[data-testid="trial-location-link-${trialSessionId}"]`,
          ).click();
          cy.get(`[data-testid="table-row-${docketNumber}"]`).should(
            'have.class',
            'aged-cases',
          );
          cy.get(`[data-testid="case-aged-icon-${docketNumber}"]`).should(
            'have.class',
            'visibility-visible',
          );
          cy.get(`[data-testid="case-aged-icon-${docketNumber}"]`).should(
            'have.attr',
            'title',
            'There has not been activity on this case for the past 12 months.',
          );
        });
      });
    });
  });
  it('should show aged cases in trial session planning report', () => {
    createAndServePaperPetition({
      trialLocation,
      procedureType: PROCEDURE_TYPES_MAP.regular,
    }).then(({ docketNumber }) => {
      loginAsDocketClerk();
      goToCase(docketNumber);
      updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
      loginAsCaseServicesSupervisor();
      cy.get('[data-testid="trial-session-link"]').click();
      cy.get('[data-testid="trial-session-planning-report-button"]').click();
      cy.get(
        '[data-testid="trial-session-planning-report-term-selector"]',
      ).then($select => {
        const firstValue = $select.find('option').eq(1).val();
        if (typeof firstValue === 'string') {
          cy.wrap($select).select(firstValue);
        }
      });
      cy.get(
        '[data-testid="trial-session-planning-report-year-selector"]',
      ).then($select => {
        const firstValue = $select.find('option').eq(1).val();
        if (typeof firstValue === 'string') {
          cy.wrap($select).select(firstValue);
        }
      });
      cy.get('[data-testid="modal-button-confirm"]').click();
      cy.intercept('GET', `/cases/*/eligible-cases`, {
        statusCode: 200,
        body: [
          {
            ...mockEligibleCase,
            docketNumber,
            docketNumberWithSuffix: `${docketNumber}L`,
            docketNumberSuffix: 'L',
            procedureType: PROCEDURE_TYPES_MAP.regular,
            isAgedCase: true,
          },
        ],
      });

      cy.get(
        '[data-testid="trial-location-link-Birmingham, Alabama"] a',
      ).click();

      cy.get(`[data-testid="eligible-case-${docketNumber}"]`).should(
        'have.class',
        'aged-cases',
      );
      cy.get(`[data-testid="case-aged-icon-${docketNumber}"]`).should(
        'have.class',
        'visibility-visible',
      );
      cy.get(`[data-testid="case-aged-icon-${docketNumber}"]`).should(
        'have.attr',
        'title',
        'There has not been activity on this case for the past 12 months.',
      );
    });
  });
});
