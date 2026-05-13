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
  before(() => {
    const trialLocation = 'Richmond, Virginia';
    const sessionType = SESSION_TYPES.small;
    const judge = 'Colvin';
    const startDate = '02/02/2233';
    const endDate = '02/03/2233';
    const proceedingType = 'In Person';
    loginAsPetitionsClerk1();
    createTrialSession({
      endDate,
      judge,
      proceedingType,
      sessionType,
      startDate,
      trialLocation,
    }).then(({ trialSessionId }) => {
      newTrialSessionId = trialSessionId;
      // create 3 cases
      for (let i = 0; i < 3; i++) {
        createAndServePaperPetition({
          procedureType: sessionType,
          trialLocation,
          includeApwDocument: false,
        }).then(({ docketNumber }) => {
          loginAsDocketClerk1();
          goToCase(docketNumber);
          updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);

          // go to the trialSession and check the QC Complete checkbox
          loginAsPetitionsClerk1();
          cy.get('[data-testid="trial-session-link"]').click();
          cy.get('[data-testid="new-trial-sessions-tab"]').click();
          cy.get(
            `[data-testid="trial-location-link-${trialSessionId}"]`,
          ).click();
          cy.get(`label[for="qc-complete-${docketNumber}"]`).click();

          // schedule the trial
          goToCase(docketNumber);
          cy.get('[data-testid="tab-case-information"]').click();
          cy.get('[data-testid="add-to-trial-session-btn"]').click();
          cy.get('[data-testid="trial-session-select"]').select(trialSessionId);
          cy.get('[data-testid="modal-button-confirm"]').click();
        });
      }
      // Calendar the trial session
      loginAsPetitionsClerk1();
      cy.get('[data-testid="inbox-tab-content"]').should('exist');
      cy.get('[data-testid="trial-session-link"]').click();
      cy.get('[data-testid="new-trial-sessions-tab"]').click();
      cy.get(`[data-testid="trial-location-link-${trialSessionId}"]`).click();
      cy.get('[data-testid="set-calendar-button"]').click();
      cy.get('[data-testid="modal-button-confirm"]').click();
    });
  });
  beforeEach(() => {
    loginAsColvin();
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get(`[data-testid="trial-location-link-${newTrialSessionId}"]`).click();

    // Reset all filters
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
    // Reset all trial statuses
    cy.get('[data-testid^="trialSessionWorkingCopy-"]').each($el => {
      cy.wrap($el).select('statusUnassigned');
    });

    cy.get(
      '[data-testid="trial-session-working-copy-filter-statusUnassigned"]',
    ).should('contain', '(3)');
  });
  it('should have all docket numbers set to statusUnassigned on initial load', () => {
    cy.get('[data-testid="trial-session-working-copy-filter-statusUnassigned"]')
      .find('span')
      .invoke('text')
      .then(text => {
        expect(text).to.equal('(3)');
      });
  });
  it('clicking the checkbox on the filter should not change the count', () => {
    cy.get(
      '[data-testid="trial-session-working-copy-filter-statusUnassigned"]',
    ).click();
    cy.get('[data-testid="trial-session-working-copy-filter-statusUnassigned"]')
      .find('span')
      .invoke('text')
      .then(text => {
        expect(text).to.equal('(3)');
      });
  });
  it('should change counts if a trial status is changed', () => {
    cy.get('[data-testid^="trialSessionWorkingCopy-"]:first').select(
      'basisReached',
    );
    cy.get('[data-testid="trial-session-working-copy-filter-statusUnassigned"]')
      .find('span')
      .invoke('text')
      .then(text => {
        expect(text).to.equal('(2)');
      });
    cy.get('[data-testid="trial-session-working-copy-filter-basisReached"]')
      .find('span')
      .invoke('text')
      .then(text => {
        expect(text).to.equal('(1)');
      });
  });
  it('should add back to statusUnassigned if trial status is changed back to unassigned', () => {
    cy.get('[data-testid^="trialSessionWorkingCopy-"]:first').select(
      'basisReached',
    );
    cy.get('[data-testid^="trialSessionWorkingCopy-"]:first').select(
      'statusUnassigned',
    );
    cy.get('[data-testid="trial-session-working-copy-filter-statusUnassigned"]')
      .find('span')
      .invoke('text')
      .then(text => {
        expect(text).to.equal('(3)');
      });
    cy.get('[data-testid="trial-session-working-copy-filter-basisReached"]')
      .find('span')
      .should('not.exist');
  });

  it('should navigate to the public copy print page when link is clicked and navigate back to session copy page', () => {
    cy.get('[data-testid="print-public-session-working-copy"]').click();
    cy.get('[data-testid="back-to-session-link"]').as('backToSessionLink');
    cy.get('@backToSessionLink').should('have.text', 'Back to Session Copy');
    cy.get('.big-blue-header').within(() => {
      cy.get('h1').should('contain.text', 'Richmond, Virginia');
    });
    cy.get('@backToSessionLink').click();
    cy.get('[data-testid="print-public-session-working-copy"]').should(
      'have.text',
      'Print Public Copy',
    );
  });

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
