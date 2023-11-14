import { fillInCreateCaseFromPaperForm } from '../support/pages/create-paper-petition';
import { getCreateACaseButton } from '../support/pages/document-qc';
import { manuallyAddCaseToNewTrialSession } from '../../cypress-smoketests/support/pages/case-detail';
import { waitForLoadingComplete } from '../support/generalCommands/waitForLoader';

describe('Trial Session Paper Pdf', { scrollBehavior: 'center' }, () => {
  it('should create a trial session, add a case, and generate a pdf for paper service', () => {
    cy.login('petitionsclerk', 'trial-sessions');

    cy.get('[data-cy="add-trial-session-button"]').click();
    cy.contains('Location-based').click();
    cy.get('[data-cy="start-date-picker"]').eq(1).type('08/20/2050');
    cy.get('[data-cy="estimated-end-date-picker"]').eq(1).type('08/22/2050');
    cy.get('[data-cy="session-type-options"]').contains('Regular').click();
    cy.get('[data-cy="trial-session-number-of-cases-allowed"]').type('20');
    cy.get('[data-cy="trial-session-proceeding-type"]')
      .contains('Remote')
      .click();
    cy.get('[data-cy="trial-session-trial-location"]').select(
      'Fresno, California',
    );
    cy.get('[data-cy="trial-session-meeting-id"]').type('123456789Meet');
    cy.get('[data-cy="trial-session-password"]').type('iamTrialSessionPass');
    cy.get('[data-cy="trial-session-join-phone-number"]').type('6473829180');
    cy.get('[data-cy="trial-session-chambers-phone-number"]').type(
      '9870654321',
    );
    cy.get('[data-cy="trial-session-judge"]').select('Buch');
    cy.get('[data-cy="trial-session-trial-clerk"]').select('Other');
    cy.get('[data-cy="trial-session-trial-clerk-alternate"]').type('Abu');
    cy.get('[data-cy="trial-session-court-reporter"]').type('Fameet');
    cy.get('[data-cy="trial-session-irs-calendar-administrator"]').type(
      'rasta reporter',
    );
    cy.intercept('POST', '**/trial-sessions').as('createTrialSession');
    cy.get('[data-cy="submit-trial-session"]').click();
    cy.wait('@createTrialSession').then(
      ({ response: trialSessionResponse }) => {
        expect(trialSessionResponse?.body).to.have.property('trialSessionId');
        const createdTrialSessionId = trialSessionResponse?.body.trialSessionId;

        cy.visit('/document-qc');
        getCreateACaseButton().click();
        cy.get('#tab-parties').parent().should('have.attr', 'aria-selected');
        fillInCreateCaseFromPaperForm();

        cy.intercept('POST', '**/paper').as('postPaperCase');
        cy.get('#submit-case').click();
        cy.wait('@postPaperCase').then(({ response: paperCaseResponse }) => {
          const petitionId = paperCaseResponse?.body.docketEntries.find(
            (d: any) => d.documentTitle === 'Petition',
          ).docketEntryId;
          const docketNumber = paperCaseResponse?.body.docketNumber;
          cy.visit(
            `/case-detail/${docketNumber}/petition-qc/document-view/${petitionId}`,
          );
          cy.get('#submit-case').click();
          cy.get('[data-cy="serve-to-irs"]').click();
          cy.intercept(`/cases/${docketNumber}/serve-to-irs`).as('serveToIrs');
          cy.get('#confirm').click();
          cy.wait('@serveToIrs');
          cy.get(
            '[data-cy="done-viewing-paper-petition-receipt-button"]',
          ).click();
          cy.url().should('include', `/case-detail/${docketNumber}`);
          cy.get('#tab-case-information').click();
          manuallyAddCaseToNewTrialSession(createdTrialSessionId);
          cy.visit(`/trial-session-detail/${createdTrialSessionId}`);
          cy.get(`label[for="${docketNumber}-complete"]`).click();
          waitForLoadingComplete();
          cy.get('#set-calendar-button').click();
          cy.get('#modal-button-confirm').click();
          waitForLoadingComplete();
          cy.url().should('include', 'print-paper-trial-notices');
          cy.get('[data-cy="printing-complete"]').click();
          cy.url().should(
            'include',
            `trial-session-detail/${createdTrialSessionId}`,
          );
          cy.visit(`/edit-trial-session/${createdTrialSessionId}`);
          cy.get('[data-cy="trial-session-judge"]').select('Colvin');
          cy.get('[data-cy="submit-edit-trial-session"]').click();
          cy.url().should('include', 'print-paper-trial-notices');
          cy.get('[data-cy="printing-complete"]').click();
          cy.url().should(
            'include',
            `trial-session-detail/${createdTrialSessionId}`,
          );
          cy.get('[data-cy="trial-session-open-paper-service-pdfs"]').click();
          cy.get('[data-cy="trial-session-paper-pdf-options"]').contains(
            'Initial Calendaring',
          );
          cy.get('[data-cy="trial-session-paper-pdf-options"]').contains(
            'Notice of Change of Trial Judge',
          );
        });
      },
    );
  });
});
