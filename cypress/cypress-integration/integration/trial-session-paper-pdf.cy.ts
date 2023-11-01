import { fillInCreateCaseFromPaperForm } from '../support/pages/create-paper-petition';
import {
  getCreateACaseButton,
  navigateTo as navigateToDocumentQC,
} from '../support/pages/document-qc';

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

        navigateToDocumentQC('petitionsclerk');
        getCreateACaseButton().click();
        cy.get('#tab-parties').parent().should('have.attr', 'aria-selected');
        fillInCreateCaseFromPaperForm();

        cy.intercept('POST', '**/paper').as('postPaperCase');
        cy.get('#submit-case').click();
        cy.wait('@postPaperCase').then(({ response: paperCaseResponse }) => {
          // cy.visit(`/case-detail/${paperCaseResponse.body.docketNumber}`);
          const petitionId = paperCaseResponse?.body.docketEntries.find(
            d => d.documentTitle === 'Petition',
          ).docketEntryId;
          const docketNumber = paperCaseResponse?.body.docketNumber;
          cy.visit(
            `/case-detail/${docketNumber}/petition-qc/document-view/${petitionId}`,
          );
          cy.get('#submit-case').click();
          cy.get('[data-cy="serve-to-irs"]').click();
          cy.get('#confirm').click();
          cy.visit(`/case-detail/${docketNumber}`);
          cy.get('#tab-case-information').click();
          cy.get('#add-to-trial-session-btn').click();
          cy.get('[data-cy="all-locations-option"]').click();
          cy.get('#trial-session').select(createdTrialSessionId);
          cy.get('#modal-button-confirm').click();
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(2000); // TODO: FIX ME - why do we need this?
          cy.visit(`/trial-session-detail/${createdTrialSessionId}`);
          cy.get(`label[for="${docketNumber}-complete"]`).click();
          cy.get('.progress-indicator').should('not.exist');
          cy.get('#set-calendar-button').click();
          cy.get('#modal-button-confirm').click();
          cy.get('.progress-indicator').should('not.exist');
          cy.visit(`/edit-trial-session/${createdTrialSessionId}`);
        });
      },
    );

    cy.get('[data-cy="trial-session-judge"]').select('Colvin');
    cy.get('[data-cy="submit-edit-trial-session"]').click();
    cy.url().should('include', 'print-paper-trial-notices');
    cy.get('[data-cy="printing-complete"]').click();
    cy.get('[data-cy="edit-trial-session"]').should('exist');
  });
});
