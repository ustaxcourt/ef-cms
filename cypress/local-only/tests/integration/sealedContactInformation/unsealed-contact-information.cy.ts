import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import {
  loginAsDocketClerk1,
  loginAsPetitionsClerk,
  loginAsPetitionsClerk1,
  loginAsPrivatePractitioner,
} from 'cypress/helpers/authentication/login-as-helpers';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { updateCaseStatus } from 'cypress/helpers/caseDetail/caseInformation/update-case-status';
import { petitionsClerkServesPetition } from 'cypress/helpers/documentQC/petitionsclerk-serves-petition';
import { externalUserCreatesElectronicCase } from 'cypress/helpers/fileAPetition/petitioner-creates-electronic-case';
import { calendarTrialSession } from 'cypress/helpers/trialSession/calendar-trial-session';
import { scheduleTrialSession } from 'cypress/helpers/trialSession/schedule-trial-session';
import {
  calculateISODate,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';

describe('Unsealed Contact Information', () => {
  const invalidFutureDate = formatDateString(
    calculateISODate({ howMuch: 1 }),
    FORMATS.MMDDYYYY,
  );
  beforeEach(() => {
    loginAsPetitionsClerk();
    createTrialSession({
      startDate: invalidFutureDate,
    }).then(({ trialSessionId }) => {
      cy.wrap(trialSessionId).as('trialSessionId');
      loginAsPrivatePractitioner();
      externalUserCreatesElectronicCase().then(docketNumber => {
        cy.wrap(docketNumber).as('docketNumber');

        loginAsPetitionsClerk1();
        petitionsClerkServesPetition(docketNumber);

        loginAsDocketClerk1();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
        calendarTrialSession(trialSessionId);
        scheduleTrialSession(docketNumber, trialSessionId);
      });
    });
  });
  it('should allow a docket clerk to seal and then unseal a petitioner address', () => {
    cy.get<string>('@docketNumber').then(docketNumber => {
      loginAsDocketClerk1();
      goToCase(docketNumber);
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="tab-parties"]').click();
      cy.get('[data-testid="edit-petitioner-button"]').click();

      // Seal the address
      cy.get('#seal-address').should('not.be.checked');
      cy.get('[data-testid="seal-address-label"]').click();
      cy.get('[data-testid="confirm-modal-header"]').should('contain', 'Seal');
      cy.get('[data-testid="modal-confirm"]').click();
      cy.get('#seal-address').should('be.checked');

      // Unseal the address
      cy.get('[data-testid="seal-address-label"]').click();
      cy.get('[data-testid="confirm-modal-header"]').should(
        'contain',
        'Unseal',
      );
      cy.get('[data-testid="modal-confirm"]').click();
      cy.get('#seal-address').should('not.be.checked');

      // Toggle again to confirm the seal/unseal routing stays correct after
      // repeated toggles (regression for stale form.contact sealed state)
      cy.get('[data-testid="seal-address-label"]').click();
      cy.get('[data-testid="confirm-modal-header"]').should('contain', 'Seal');
      cy.get('[data-testid="modal-confirm"]').click();
      cy.get('#seal-address').should('be.checked');
    });
  });
});
