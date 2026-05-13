import {
  loginAsColvin,
  loginAsDocketClerk1,
  loginAsPetitionsClerk1,
} from 'cypress/helpers/authentication/login-as-helpers';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import {
  CASE_STATUS_TYPES,
  SESSION_TYPES,
} from '@shared/business/entities/EntityConstants';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { updateCaseStatus } from 'cypress/helpers/caseDetail/caseInformation/update-case-status';

describe('trials session working copies filtering', () => {
  let newTrialSessionId: string;

  const trialLocation = 'Richmond, Virginia';
  const sessionType = SESSION_TYPES.small;
  const judge = 'Colvin';
  const startDate = '02/02/2233';
  const endDate = '02/03/2233';
  const proceedingType = 'In Person';

  const visitTrialSessionDetail = (trialSessionId: string): void => {
    cy.visit(`/trial-session-detail/${trialSessionId}`);
  };

  const openSessionWorkingCopyAsJudge = (trialSessionId: string): void => {
    loginAsColvin();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get(`[data-testid="trial-location-link-${trialSessionId}"]`).click();
  };

  const markCaseQcComplete = (
    docketNumber: string,
    trialSessionId: string,
  ): void => {
    loginAsPetitionsClerk1();
    visitTrialSessionDetail(trialSessionId);
    cy.get(`[data-testid="qc-complete-${docketNumber}"]`).click({
      force: true,
    });
  };

  const scheduleCaseForTrialSession = (
    docketNumber: string,
    trialSessionId: string,
  ): void => {
    loginAsPetitionsClerk1();
    goToCase(docketNumber);
    cy.get('[data-testid="tab-case-information"]').click();
    cy.get('[data-testid="add-to-trial-session-btn"]').click();
    cy.get('[data-testid="trial-session-select"]').select(trialSessionId);
    cy.get('[data-testid="modal-button-confirm"]').click();
  };

  const createReadyForTrialCalendaredCase = (
    trialSessionId: string,
  ): Cypress.Chainable<undefined> => {
    return createAndServePaperPetition({
      procedureType: sessionType,
      trialLocation,
      includeApwDocument: false,
    }).then(({ docketNumber }) => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);

      markCaseQcComplete(docketNumber, trialSessionId);
      scheduleCaseForTrialSession(docketNumber, trialSessionId);

      return cy.wrap(undefined);
    });
  };

  const createReadyForTrialCalendaredCases = (
    trialSessionId: string,
    remainingCases: number,
  ): Cypress.Chainable<undefined> => {
    if (remainingCases === 0) {
      return cy.wrap(undefined);
    }

    return createReadyForTrialCalendaredCase(trialSessionId).then(() => {
      return createReadyForTrialCalendaredCases(
        trialSessionId,
        remainingCases - 1,
      );
    });
  };

  const resetWorkingCopyFiltersAndStatuses = (): void => {
    cy.get('[data-testid^="trial-session-working-copy-filter-"]').each(
      $filterDiv => {
        cy.wrap($filterDiv)
          .find('input[type="checkbox"]')
          .then($checkbox => {
            if (!$checkbox.prop('checked')) {
              cy.wrap($filterDiv).find('label').click();
            }
          });
      },
    );

    cy.get('[data-testid^="trialSessionWorkingCopy-"]').each($el => {
      cy.wrap($el).select('statusUnassigned');
    });
  };

  const assertUnassignedCount = (count: number): void => {
    cy.get('[data-testid="trial-session-working-copy-filter-statusUnassigned"]')
      .find('span')
      .should('have.text', `(${count})`);
  };

  before(() => {
    loginAsPetitionsClerk1();

    return createTrialSession({
      endDate,
      judge,
      proceedingType,
      sessionType,
      startDate,
      trialLocation,
    }).then(({ trialSessionId }) => {
      newTrialSessionId = trialSessionId;

      return createReadyForTrialCalendaredCases(trialSessionId, 3).then(() => {
        loginAsPetitionsClerk1();
        visitTrialSessionDetail(trialSessionId);
        cy.get('[data-testid="set-calendar-button"]').click();
        cy.get('[data-testid="modal-button-confirm"]').click();
      });
    });
  });

  beforeEach(() => {
    openSessionWorkingCopyAsJudge(newTrialSessionId);
    resetWorkingCopyFiltersAndStatuses();
    assertUnassignedCount(3);
  });

  it('should have all docket numbers set to statusUnassigned on initial load', () => {
    assertUnassignedCount(3);
  });

  it('clicking the checkbox on the filter should not change the count', () => {
    cy.get(
      '[data-testid="trial-session-working-copy-filter-statusUnassigned"]',
    ).click();
    assertUnassignedCount(3);
  });

  it('should change counts if a trial status is changed', () => {
    cy.get('[data-testid^="trialSessionWorkingCopy-"]:first').select(
      'basisReached',
    );
    assertUnassignedCount(2);
    cy.get('[data-testid="trial-session-working-copy-filter-basisReached"]')
      .find('span')
      .should('have.text', '(1)');
  });

  it('should add back to statusUnassigned if trial status is changed back to unassigned', () => {
    cy.get('[data-testid^="trialSessionWorkingCopy-"]:first').select(
      'basisReached',
    );
    cy.get('[data-testid^="trialSessionWorkingCopy-"]:first').select(
      'statusUnassigned',
    );
    assertUnassignedCount(3);
    cy.get('[data-testid="trial-session-working-copy-filter-basisReached"]')
      .find('span')
      .should('not.exist');
  });

  it('should navigate to the public copy print page when link is clicked and navigate back to session copy page', () => {
    cy.get('[data-testid="print-public-session-working-copy"]').click();
    cy.get('[data-testid="back-to-session-link"]').should(
      'have.text',
      'Back to Session Copy',
    );

  it('should include closed dismissed cases in the working copy list', () => {
    // Get the first docket number from the working copy
    cy.get('[data-testid^="trialSessionWorkingCopy-"]')
      .first()
      .invoke('attr', 'data-testid')
      .then(testId => {
        const docketNumber =
          testId?.replace('trialSessionWorkingCopy-', '') || '';

        // Update the first case to closedDismissed status
        loginAsDocketClerk1();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.closedDismissed);

        // Navigate back to the trial session working copy
        loginAsColvin();
        cy.get('[data-testid="trial-session-link"]').click();
        cy.get(
          `[data-testid="trial-location-link-${newTrialSessionId}"]`,
        ).click();

        // Verify the closed dismissed case is still displayed in the working copy
        cy.get(
          `[data-testid="trialSessionWorkingCopy-${docketNumber}"]`,
        ).should('exist');

        // Verify all three cases are still visible (closed dismissed should not be filtered out)
        cy.get('[data-testid^="trialSessionWorkingCopy-"]').should(
          'have.length',
          3,
        );
      });
  });
});
