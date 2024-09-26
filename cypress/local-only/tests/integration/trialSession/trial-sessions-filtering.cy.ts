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
    createTrialSession({
      endDate,
      judge,
      proceedingType,
      sessionType,
      startDate,
      trialLocation,
    }).then(({ trialSessionId }) => {
      cy.get('[data-testid="trial-session-link"]').click();
      cy.get('[data-testid="new-trial-sessions-tab"]').click();
      selectTypeaheadInput(
        'trial-session-location-filter-search',
        trialLocation,
      );
      selectTypeaheadInput('trial-session-judge-filter-search', judge);
      selectTypeaheadInput('trial-session-type-filter-search', sessionType);
      cy.get(`[data-testid="proceedingType-${proceedingType}"]`).click();
      cy.get('[data-testid="trialSessionFirstStartDate-date-start-input"]')
        .eq(1)
        .type(startDate);
      cy.get('[data-testid="trialSessionLastStartDate-date-end-input"]')
        .eq(1)
        .type(endDate);
      createAndServePaperPetition({
        procedureType: sessionType,
        trialLocation,
      }).then(({ docketNumber }) => {
        loginAsDocketClerk1();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
        loginAsPetitionsClerk1();
        cy.get('[data-testid="trial-session-link"]').click();
        cy.log(docketNumber);
        cy.visit(`/trial-session-detail/${trialSessionId}`);
        cy.get(`[data-testid="qc-complete-${docketNumber}"]:checked`).should(
          'not.exist',
        );
        cy.get(`label[for="qc-complete-${docketNumber}"]`).click();
        cy.get(`[data-testid="qc-complete-${docketNumber}"]:checked`).should(
          'exist',
        );
        cy.get('[data-testid="set-calendar-button"]').click();
        cy.get('#modal-button-confirm').click();
        cy.url().should('include', 'print-paper-trial-notices');
        cy.get('[data-testid="printing-complete"]').click();
        cy.url().should('include', `trial-session-detail/${trialSessionId}`);
      });
    });
  });
});

/*
X create a trial session
see that that trial session shows in new trial session tab
X create a case
X set case as ready for trial
X petition clerk views eligible cases
not needed? ----- petition clerk manually adds case to trial session
X mark trial session cases as QC'd
X set trial session schedule
View that the trial session is now in the "Calendared" tab and in OPEN status
Remove a case from the trial session
View trial session in "Calendared" tab and in Closed status
View trial session in "Calendared" tab when  looking at ALL filter
});
*/
