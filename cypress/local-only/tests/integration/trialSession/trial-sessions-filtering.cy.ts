import {
  CASE_STATUS_TYPES,
  SESSION_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { createTrialSession } from '../../../../helpers/trialSession/create-trial-session';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk1,
  loginAsPetitionsClerk1,
} from '../../../../helpers/authentication/login-as-helpers';
import { selectTypeaheadInput } from '../../../../helpers/components/typeAhead/select-typeahead-input';
import { updateCaseStatus } from '../../../../helpers/caseDetail/caseInformation/update-case-status';

describe('trial sessions filtering', () => {
  it('should filter trial sessions', () => {
    const trialLocation = 'Honolulu, Hawaii';
    const sessionType = SESSION_TYPES.small;
    const judge = 'Carluzzo';
    const startDate = '02/02/2233';
    const endDate = '02/03/2233';
    const proceedingType = 'In Person';

    loginAsPetitionsClerk1();
    // create a trial session
    createTrialSession({
      endDate,
      judge,
      proceedingType,
      sessionType,
      startDate,
      trialLocation,
    }).then(({ trialSessionId }) => {
      // see that that trial session shows in new trial session tab
      cy.get('[data-testid="trial-session-link"]').click();
      setTrialSessionFilters({
        judge,
        proceedingType,
        sessionType,
        startDate,
        tabName: 'new',
        trialLocation,
      });

      cy.get(`[data-testid="trial-sessions-row-${trialSessionId}"]`).should(
        'exist',
      );

      // create a case
      createAndServePaperPetition({
        procedureType: sessionType,
        trialLocation,
      }).then(({ docketNumber }) => {
        // set case as ready for trial
        loginAsDocketClerk1();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);

        // mark trial session cases as QC'd
        loginAsPetitionsClerk1();
        cy.get('[data-testid="trial-session-link"]').click();
        cy.visit(`/trial-session-detail/${trialSessionId}`);
        cy.get(`[data-testid="qc-complete-${docketNumber}"]:checked`).should(
          'not.exist',
        );
        cy.get(`label[for="qc-complete-${docketNumber}"]`).click();
        cy.get(`[data-testid="qc-complete-${docketNumber}"]:checked`).should(
          'exist',
        );
        // set trial session schedule
        cy.get('[data-testid="set-calendar-button"]').click();
        cy.get('#modal-button-confirm').click();
        cy.url().should('include', 'print-paper-trial-notices');
        cy.get('[data-testid="printing-complete"]').click();
        cy.url().should('include', `trial-session-detail/${trialSessionId}`);

        // View that the trial session is now in the "Calendared" tab and in OPEN status
        cy.get('[data-testid="trial-session-link"]').click();
        setTrialSessionFilters({
          judge,
          proceedingType,
          sessionStatus: 'Open',
          sessionType,
          startDate,
          tabName: 'calendared',
          trialLocation,
        });

        cy.get(`[data-testid="trial-sessions-row-${trialSessionId}"]`).should(
          'exist',
        );

        //Remove a case from the trial session
        goToCase(docketNumber);
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('#edit-case-trial-information-btn').click();
        cy.get('#remove-from-trial-session-btn').click();
        cy.get(
          '[data-testid="remove-from-trial-session-disposition-textarea"]',
        ).type(
          'We are removing the case from the trial session to close the trial session.',
        );
        cy.get('[data-testid="modal-button-confirm"]').click();

        // View trial session in "Calendared" tab and in Closed status
        cy.get('[data-testid="trial-session-link"]').click();
        setTrialSessionFilters({
          judge,
          proceedingType,
          sessionStatus: 'Closed',
          sessionType,
          startDate,
          tabName: 'calendared',
          trialLocation,
        });

        cy.get(`[data-testid="trial-sessions-row-${trialSessionId}"]`).should(
          'exist',
        );

        //View trial session in "Calendared" tab when  looking at ALL filter
        setTrialSessionFilters({
          judge,
          proceedingType,
          resetFilters: true,
          sessionStatus: 'All',
          sessionType,
          startDate,
          tabName: 'calendared',
          trialLocation,
        });

        cy.get(`[data-testid="trial-sessions-row-${trialSessionId}"]`).should(
          'exist',
        );
      });
    });
  });
});

function setTrialSessionFilters({
  judge,
  proceedingType,
  resetFilters,
  sessionStatus,
  sessionType,
  startDate,
  tabName,
  trialLocation,
}: {
  resetFilters?: boolean;
  tabName: 'calendared' | 'new';
  proceedingType: string;
  startDate: string;
  sessionType: string;
  trialLocation: string;
  judge: string;
  sessionStatus?: string;
}) {
  cy.get(`[data-testid="${tabName}-trial-sessions-tab"]`).click();
  if (resetFilters) {
    cy.get('[data-testid="trial-session-reset-filter-button"]').click();
  }
  if (sessionStatus) {
    cy.get(`[data-testid="sessionStatus-${sessionStatus}"]`).click();
  }
  cy.get(`[data-testid="proceedingType-${proceedingType}"]`).click();
  cy.get('[data-testid="trialSessionFirstStartDate-date-start-input"]')
    .eq(1)
    .type(startDate);
  cy.get('[data-testid="trialSessionLastStartDate-date-end-input"]')
    .eq(1)
    .type(startDate);
  selectTypeaheadInput('trial-session-type-filter-search', sessionType);
  selectTypeaheadInput('trial-session-location-filter-search', trialLocation);
  selectTypeaheadInput('trial-session-judge-filter-search', judge);
}
