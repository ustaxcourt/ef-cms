import {
  loginAsPetitionsClerk1,
} from '../../../../helpers/authentication/login-as-helpers';
import { createTrialSession } from '../../../../helpers/trialSession/create-trial-session';
import { createAndServePaperPetition } from '../../../../helpers/fileAPetition/create-and-serve-paper-petition';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  SESSION_TYPES,
} from '@shared/business/entities/EntityConstants';

describe('Trial Session Blocked Cases', () => {
  const trialLocation = `Phoenix, Arizona`;

  beforeEach(() => {
    loginAsPetitionsClerk1();
    createTrialSession({
      trialLocation,
      sessionType: SESSION_TYPES.small,
      startDate: '12/12/2025',
      endDate: '12/12/2025',
      judge: 'Cohen',
      maxCases: '3',
    })
  });

  it('should automatically block case when APW is included in paper petition and verify blocked label is present', () => {
    createAndServePaperPetition({
      procedureType: 'Small',
      trialLocation,
      caseType: 'Other',
      yearReceived: '2019',
      includeApwDocument: true,
    }).then(({ docketNumber }) => {

      goToCase(docketNumber);
      
      cy.get('[data-testid="tab-tracked-items"]').click();
      cy.get('[data-testid="pending-report-tab"]').click();
      cy.get('#pending-items').should('exist');
      cy.get('#pending-items').should('contain', 'Application for Waiver of Filing Fee');

      cy.get('[data-testid="blocked-case-icon"]').should('exist');
    });
  });

  it('should verify case appears in pending reports when APW is included', () => {
    createAndServePaperPetition({
      procedureType: 'Small',
      trialLocation,
      caseType: 'Other',
      yearReceived: '2019',
      includeApwDocument: true,
    }).then(({ docketNumber }) => {

      cy.visit('/reports');
      cy.get('[data-testid="dropdown-select-report"]').click();
      cy.get('[data-testid="select-pending-report"]').click();
      cy.get('[data-testid="dropdown-select-judge"]').select('Chief Judge');

      cy.get('[data-testid="display-pending-report-table"]').should(
        'contain',
        docketNumber,
      );
    });
  });
});
