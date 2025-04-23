import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';

import {
  loginAsCaseServicesSupervisor,
  loginAsColvin,
} from '../../../../helpers/authentication/login-as-helpers';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { createAndServePaperFiling } from 'cypress/helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';

describe('file motion response order', () => {
  const today = formatNow(FORMATS.MMDDYYYY);
  const formattedToday = formatNow(FORMATS.MONTH_DAY_YEAR);
  const motionType = 'Motion for a New Trial';
  let storeDocketNumber;

  describe('judge', () => {
    before(() => {
      loginAsCaseServicesSupervisor();
      createAndServePaperPetition({
        yearReceived: '2025',
      }).then(({ docketNumber }) => {
        storeDocketNumber = docketNumber;
        cy.wrap(docketNumber).as('docketNumber');
        // use these explicitely or delete them
        cy.wrap(formattedToday).as('formattedToday');
        cy.wrap(today).as('today');
        loginAsCaseServicesSupervisor();
        cy.visit(`/case-detail/${docketNumber}`);

        createAndServePaperFiling({
          dateReceived: today,
          documentType: motionType,
        });
      });
      cy.then(() => {
        loginAsColvin();
      });
    });

    describe('filing a motion response order from document view', () => {
      it('should be able a simple motion response order', () => {
        const expectedContents = [
          formattedToday,
          `petitioner filed a ${motionType}`,
        ];

        cy.visit(`/case-detail/${storeDocketNumber}`);

        cy.get(
          '[data-testid="docket-entry-filingsAndProceedings-7"] > button',
        ).click();
        cy.get('[data-testid="order-response-button"]').click();

        cy.get('#response-date-input-orderResponseResponseDate-picker').type(
          today,
        );
        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          cy.log('request body: ', req.body.contentHtml);
          expectedContents.forEach(text => {
            expect(req.body.contentHtml).to.include(text);
          });
        });

        cy.contains('Apply Signature').should('exist');

        cy.get('[data-testid="skip-signature-button"]').click();
        cy.get('#tab-drafts').click();
      });

      it('should save signed draft when all options are selected', () => {
        cy.visit(`/case-detail/${storeDocketNumber}`);
        // Track the current draft count for comparison later
        cy.get(
          '[data-testid="docket-entry-filingsAndProceedings-7"] > button',
        ).click();
        cy.get('[data-testid="order-response-button"]').click();
        cy.get('#response-date-input-orderResponseResponseDate-picker').type(
          today,
        );
        cy.get('#motion-order-reply').check({ force: true });
        cy.get('#due-date-input-motionOrderResponseDueDate-picker').type(today);
        cy.get('#additional-text').type('Test');
        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

        // TODO: To be continued
      });
    });
  });
});
