import {
  FORMATS,
  formatNow,
} from '../../../../../shared/src/business/utilities/DateHandler';

import { createAndServeConsolidatedGroup } from 'cypress/helpers/fileAPetition/create-consolidated-case-group';
import {
  loginAsCaseServicesSupervisor,
  loginAsColvin,
} from '../../../../helpers/authentication/login-as-helpers';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { createAndServePaperFiling } from 'cypress/helpers/caseDetail/docketRecord/paperFiling/create-and-serve-paper-filing';
import { retry } from 'cypress/helpers/retry';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';

describe('file motion response order', () => {
  const today = formatNow(FORMATS.MMDDYYYY);
  const formattedToday = formatNow(FORMATS.MONTH_DAY_YEAR);
  const motionType = 'Motion for a New Trial';

  describe('judge', () => {
    before(() => {
      loginAsCaseServicesSupervisor();
      createAndServePaperPetition({
        yearReceived: '2025',
      }).then(({ docketNumber }) => {
        Cypress.env('docketNumber', docketNumber);
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
      it('should be able to create a simple motion response order', () => {
        const expectedContents = [
          formattedToday,
          `petitioner filed a ${motionType}`,
        ];

        cy.visit(`/case-detail/${Cypress.env('docketNumber')}`);

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
          expectedContents.forEach(text => {
            expect(req.body.contentHtml).to.include(text);
          });
        });

        cy.contains('Apply Signature').should('exist');

        cy.get('[data-testid="skip-signature-button"]').click();
        cy.get('#tab-drafts').click();
      });

      it('should save signed draft', () => {
        const expectedContents = `On ${formattedToday}`;

        cy.visit(`/case-detail/${Cypress.env('docketNumber')}`);
        cy.get('#tab-document-view').click();

        cy.contains('Motion for a New Trial').click();
        cy.get('[data-testid="order-response-button"]').click();
        cy.get('#response-date-input-orderResponseResponseDate-picker').type(
          today,
        );

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expect(req.body.contentHtml).to.include(expectedContents);
        });
        cy.contains('Apply Signature').should('exist');

        cy.get('[data-testid="sign-pdf-canvas"]').click();
        cy.get('[data-testid="save-signature-button"]').click();
        cy.get('#tab-drafts').click();
        cy.contains('Remove Signature').should('exist');
      });

      it('should save unsigned draft of order', () => {
        // get the last order index
        const expectedContents = `On ${formattedToday}`;

        cy.visit(`/case-detail/${Cypress.env('docketNumber')}`);
        cy.get('#tab-document-view').click();

        cy.contains('Motion for a New Trial').click();
        cy.get('[data-testid="order-response-button"]').click();
        cy.get('#response-date-input-orderResponseResponseDate-picker').type(
          today,
        );

        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );
        cy.get('[data-testid="save-draft-button"]').click();

        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expect(req.body.contentHtml).to.include(expectedContents);
        });
        cy.contains('Apply Signature').should('exist');
        cy.contains('Skip Signature').click();
        cy.contains('Remove Signature').should('not.exist');
      });

      it('should be able to create a motion response order when all options are selected', () => {
        const expectedContents = [
          'respondent shall file a Response to the Motion for a New Trial',
          `by ${formattedToday} petitioner may file a Reply. It is further`,
          'Test additional text box',
        ];
        cy.visit(`/case-detail/${Cypress.env('docketNumber')}`);
        cy.get(
          '[data-testid="docket-entry-filingsAndProceedings-7"] > button',
        ).click();
        cy.get('[data-testid="order-response-button"]').click();
        cy.get('#response-date-input-orderResponseResponseDate-picker').type(
          today,
        );
        cy.get('#motion-order-reply').check({ force: true });
        cy.get('#due-date-input-motionOrderResponseDueDate-picker').type(today);
        cy.get('#additional-text').type('Test additional text box');
        cy.intercept('POST', '**/api/court-issued-order').as(
          'courtIssuedOrder',
        );

        cy.get('[data-testid="save-draft-button"]').click();
        cy.wait('@courtIssuedOrder').then(({ request: req }) => {
          expectedContents.forEach(text => {
            expect(req.body.contentHtml).to.include(text);
          });
        });
      });
    });
  });

  describe('pdf preview', () => {
    it('should show a pdf preview when clicking preview pdf', () => {
      cy.visit(`/case-detail/${Cypress.env('docketNumber')}`);
      cy.get('#tab-document-view').click();
      cy.contains('Motion for a New Trial').click(); // TODO 10586: use this everywhere
      cy.get('[data-testid="order-response-button"]').click();
      cy.get('#response-date-input-orderResponseResponseDate-picker').type(
        today,
      );
      cy.get('[data-testid="preview-pdf-button"]').click();

      // Expect pdf wrapper to contain preview content
      retry(() => {
        return cy.get('body').then(body => {
          /** Assert */
          return (
            body.find('[data-testid="motion-response-order-pdf-preview"]')
              .children.length > 1
          );
        });
      });
    });
  });

  describe('Consolidated Cases', () => {
    before(() => {
      // create another case to add to our initial case as a consolidated case));
      createAndServeConsolidatedGroup().then(({ leadDocketNumber }) => {
        loginAsCaseServicesSupervisor();
        cy.visit(`/case-detail/${leadDocketNumber}`);

        createAndServePaperFiling({
          dateReceived: today,
          documentType: motionType,
        });

        loginAsColvin();
        cy.visit(`/case-detail/${leadDocketNumber}`);
      });
    });

    it('should be able to create a motion response order for a lead case ina consolidated group', () => {
      const expectedContents = [
        `On ${formattedToday}, petitioner filed a Motion for a New Trial`,
        'Lead case Document no.',
      ];
      const ALL_CASES = 'All cases in this group';
      cy.get('#tab-document-view').click();
      cy.contains('Motion for a New Trial').click();
      cy.get('[data-testid="order-response-button"]').click();
      cy.get('#response-date-input-orderResponseResponseDate-picker').type(
        today,
      );

      cy.get(`input[type="radio"][value="${ALL_CASES}"]`).should('be.checked');
      cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');
      cy.get('[data-testid="save-draft-button"]').click();
      cy.wait('@courtIssuedOrder').then(({ request: req }) => {
        expectedContents.forEach(text => {
          expect(req.body.contentHtml).to.include(text);
        });
      });
    });
  });

  describe('Trial Session', () => {
    before(() => {
      loginAsCaseServicesSupervisor();
      createTrialSession().then(({ trialSessionId }) => {
        cy.wrap(trialSessionId).as('trialSessionId');
        cy.get('[data-testid="new-trial-sessions-tab"]').click();
        cy.contains('Anchorage, Alaska').last().click();
        cy.contains('Set Calendar').click();
        cy.contains('Yes, Set Calendar').click();
      });
      createAndServePaperPetition({
        yearReceived: '2025',
      }).then(({ docketNumber }) => {
        loginAsCaseServicesSupervisor();
        cy.visit(`/case-detail/${docketNumber}`);
        createAndServePaperFiling({
          dateReceived: today,
          documentType: motionType,
        });
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('[data-testid="add-to-trial-session-btn"]').click();
        cy.get('#show-all-locations-true').click({ force: true });

        cy.get('[data-testid="trial-session-select"] option')
          .eq(1)
          .then($option => {
            const value: string = $option.val() as string;
            cy.get('[data-testid="trial-session-select"]').select(value);
          });

        cy.contains('Add Case').click();

        loginAsColvin();
        cy.visit(`/case-detail/${docketNumber}`);
      });
    });

    it('should allow judge to strike case from trial session', () => {
      const expectedContents = [
        `On ${formattedToday}, petitioner filed a Motion for a New Trial`,
        'this case is stricken from the trial session.',
        'jurisdiction is retained by the undersigned',
      ];
      cy.get('#tab-document-view').click();
      cy.contains('Motion for a New Trial').click();
      cy.get('[data-testid="order-response-button"]').click();
      cy.get('#response-date-input-orderResponseResponseDate-picker').type(
        today,
      );

      cy.get('#case-is-stricken-from-trial-session').check({ force: true });
      cy.get('#case-is-stricken-from-trial-session').should('be.checked');

      cy.intercept('POST', '**/api/court-issued-order').as('courtIssuedOrder');
      cy.get('[data-testid="save-draft-button"]').click();
      cy.wait('@courtIssuedOrder').then(({ request: req }) => {
        expectedContents.forEach(text => {
          expect(req.body.contentHtml).to.include(text);
        });
      });
    });
  });
});
