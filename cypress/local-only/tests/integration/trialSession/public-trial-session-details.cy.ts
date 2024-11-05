import { SESSION_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { createTrialSession } from '../../../../helpers/trialSession/create-trial-session';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';
import {
  loginAsDocketClerk,
  loginAsPetitioner,
} from '../../../../helpers/authentication/login-as-helpers';
import { navigateToDashboard } from '../../../support/pages/maintenance';
import { petitionerCreatesElectronicCaseWithSpouse } from '../../../../helpers/fileAPetition/petitioner-creates-electronic-case';
import { petitionsClerkServesPetition } from '../../../../helpers/documentQC/petitionsclerk-serves-petition';

describe('Public Trial Session Details', () => {
  const publicUrlPort = '5678';

  it('should show trial session details', () => {
    navigateToDashboard();
    loginAsPetitioner();
    petitionerCreatesElectronicCaseWithSpouse().then(docketNumber => {
      petitionsClerkServesPetition(docketNumber);
      loginAsDocketClerk();
      createTrialSession({ sessionType: SESSION_TYPES.motionHearing }).then(
        ({ trialSessionId }) => {
          goToCase(docketNumber);
          // Add the case to the trial session, and seal it
          cy.get('[data-testid="tab-case-information"]').click();
          cy.get('#add-to-trial-session-btn').click();
          cy.get('label[for="show-all-locations-true"]').click();
          cy.get('select#trial-session').select(trialSessionId);
          cy.get('select#trial-session').should('have.value', trialSessionId);
          cy.get('#modal-root .modal-button-confirm').click();
          cy.get('.usa-alert--success').should('exist');
          cy.get('[data-testid="seal-case-button"]').click();
          cy.get('[data-testid="modal-button-confirm"]').click();
          cy.get('.usa-alert--success').contains('Case sealed');

          // Visit the trial session details as a public user and check that expected information is rendered
          cy.visit(
            `http://localhost:${publicUrlPort}/trial-session-detail/${trialSessionId}`,
          );
          cy.get('[data-testid="public-trial-session-details-box"]').should(
            'exist',
          );
          cy.contains(
            /Information on this page is current as of \d{2}\/\d{2}\/\d{2} ([1-9]|1[0-2]):\d{2} (am|pm) Eastern\./,
          ).should('exist');
          cy.contains('Count: 1');
          cy.get(
            `[data-testid="trial-session-detail-row-${docketNumber}"]`,
          ).should('exist');
          cy.get('[data-testid="case-sealed-icon"]').should('exist');
          cy.get('[data-testid="case-link"]').contains(docketNumber);
        },
      );
    });
  });
});
