import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import {
  loginAsCaseServicesSupervisor,
  loginAsColvin,
} from 'cypress/helpers/authentication/login-as-helpers';
import { createAndServePaperFiling } from 'cypress/helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import { calendarTrialSession } from 'cypress/helpers/trialSession/calendar-trial-session';
import { scheduleTrialSession } from 'cypress/helpers/trialSession/schedule-trial-session';

describe('edit motion response order', () => {
  const today = formatNow(FORMATS.MMDDYYYY);
  const motionType = 'Motion for a New Trial';

  describe('judge', () => {
    before(() => {
      loginAsCaseServicesSupervisor();
      createAndServePaperPetition({
        yearReceived: '2025',
      }).then(({ docketNumber }) => {
        cy.wrap(docketNumber).as('docketNumber');
        loginAsCaseServicesSupervisor();
        cy.visit(`/case-detail/${docketNumber}`);

        createAndServePaperFiling({
          dateReceived: today,
          documentType: motionType,
        });
        createTrialSession().then(({ trialSessionId }) => {
          calendarTrialSession(trialSessionId);
          scheduleTrialSession(docketNumber, trialSessionId);
        });
      });
      cy.get<string>('@docketNumber').then(docketNumber => {
        loginAsColvin();
        cy.visit(`/case-detail/${docketNumber}`);
      });
    });

    it('should load existing unsigned order', () => {
      const contentsAfterEdit = 'This is a test order';

      cy.get(
        '[data-testid="docket-entry-filingsAndProceedings-7"] > button',
      ).click();
      cy.get('[data-testid="order-response-button"]').click();

      cy.get('#response-date-input-orderResponseResponseDate-picker').type(
        today,
      );
      cy.get('[data-testid="motion-order-reply"]').check({
        force: true,
      });
      cy.get('[data-testid="due-date-input-motionOrderResponseDueDate-picker"]')
        .last()
        .type(today);
      cy.get('#case-is-stricken-from-trial-session').check({
        force: true,
      });

      cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');
      cy.get('[data-testid="save-draft-button"]').click();
      cy.contains('Apply Signature').should('exist');

      cy.wait('@courtIssuedOrder').then(({ request: req }) => {
        expect(req.body.contentHtml).to.not.include(contentsAfterEdit);
      });

      cy.get('[data-testid="skip-signature-button"]').click();
      cy.get('#tab-drafts').click();

      cy.get('[data-testid="docket-entry-description-4"]').click();
      cy.get('[data-testid="draft-edit-button-not-signed"]').click();

      // Enure pre-loaded date is correct
      cy.get('#response-date-input-orderResponseResponseDate-picker').should(
        'have.value',
        today,
      );

      cy.get('[data-testid="motion-order-reply"]').should('be.checked');
      cy.get('[data-testid="due-date-input-motionOrderResponseDueDate-picker"]')
        .last()
        .should('have.value', today);
      cy.get('#case-is-stricken-from-trial-session').should('be.checked');

      cy.get('#additional-order-text-array-0').should('have.value', '');

      cy.get('#additional-order-text-array-0').type(contentsAfterEdit);
      cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');
      cy.get('[data-testid="save-draft-button"]').click();
      cy.get('[data-testid="skip-signature-button"]').click();
      cy.get('[data-testid="draft-edit-button-not-signed"]').click();
      cy.get('#additional-order-text-array-0').should(
        'have.value',
        contentsAfterEdit,
      );
    });
  });
});
