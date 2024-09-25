import { SESSION_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { createTrialSession } from '../../../../helpers/trialSession/create-trial-session';
import { loginAsPetitionsClerk1 } from '../../../../helpers/authentication/login-as-helpers';

describe('trial sesions filtering', () => {
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
    });
    cy.get('[data-testid="trial-session-link"]').click();
    cy.get('[data-testid="new-trial-sessions-tab"]').click();
    // createAndServePaperPetition({ trialLocation }).then(({ docketNumber }) => {
    // });
  });
});

/*
X create a trial session
see that that trial session shows in new trial session tab
X create a case
set case as ready for trial
petition clerk views eligible cases
petition clerk manually adds case to trial session
mark trial session cases as QC'd
set trial session schedule
View that the trial session is now in the "Calendared" tab and in OPEN status
Remove a case from the trial session
View trial session in "Calendared" tab and in Closed status
View trial session in "Calendared" tab when  looking at ALL filter
});
*/
