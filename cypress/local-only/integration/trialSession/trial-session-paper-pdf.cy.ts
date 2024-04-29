import { fillInCreateCaseFromPaperForm } from '../../support/pages/create-paper-petition';
import { getCreateACaseButton } from '../../support/pages/document-qc';

describe('Trial Session Paper Pdf', { scrollBehavior: 'center' }, () => {
  it('should create a trial session, add a case, and generate a pdf for paper service', () => {
    cy.login('petitionsclerk', 'trial-sessions');

    cy.get('[data-testid="add-trial-session-button"]').click();
    cy.contains('Location-based').click();
    cy.get('[data-testid="start-date-picker"]').eq(1).type('08/20/2050');
    cy.get('[data-testid="estimated-end-date-picker"]')
      .eq(1)
      .type('08/22/2050');
    cy.get('[data-testid="session-type-options"]').contains('Regular').click();
    cy.get('[data-testid="trial-session-number-of-cases-allowed"]').type('20');
    cy.get('[data-testid="trial-session-proceeding-type"]')
      .contains('Remote')
      .click();
    cy.get('[data-testid="trial-session-trial-location"]').select(
      'Fresno, California',
    );
    cy.get('[data-testid="trial-session-meeting-id"]').type('123456789Meet');
    cy.get('[data-testid="trial-session-password"]').type(
      'iamTrialSessionPass',
    );
    cy.get('[data-testid="trial-session-join-phone-number"]').type(
      '6473829180',
    );
    cy.get('[data-testid="trial-session-chambers-phone-number"]').type(
      '9870654321',
    );
    cy.get('[data-testid="trial-session-judge"]').select('Buch');
    cy.get('[data-testid="trial-session-trial-clerk"]').select('Other');
    cy.get('[data-testid="trial-session-trial-clerk-alternate"]').type('Abu');
    cy.get('[data-testid="trial-session-court-reporter"]').type('Fameet');
    cy.get(
      '#irs-calendar-administrator-info-search .select-react-element__input-container input',
    ).clear();
    cy.get(
      '#irs-calendar-administrator-info-search .select-react-element__input-container input',
    ).type('Nero West');
    cy.get('#react-select-2-option-0').click({ force: true });

    cy.intercept('POST', '**/trial-sessions').as('createTrialSession');
    cy.get('[data-testid="submit-trial-session"]').click();
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
          cy.get('[data-testid="serve-case-to-irs"]').click();
          cy.intercept(`/async/cases/${docketNumber}/serve-to-irs`).as(
            'serveToIrs',
          );
          cy.get('#confirm').click();
          cy.wait('@serveToIrs');
          cy.get(
            '[data-testid="done-viewing-paper-petition-receipt-button"]',
          ).click();
          cy.url().should('include', `/case-detail/${docketNumber}`);
          cy.get('#tab-case-information').click();
          cy.get('#add-to-trial-session-btn').should('exist').click();
          cy.get('label[for="show-all-locations-true"]').click();
          cy.get('select#trial-session').select(createdTrialSessionId);
          cy.get('select#trial-session').should(
            'have.value',
            createdTrialSessionId,
          );
          cy.get('#modal-root .modal-button-confirm').click();
          cy.get('.usa-alert--success').should(
            'contain',
            'Case scheduled for trial.',
          );
          cy.get('h3:contains("Trial - Scheduled")').should('exist');
          cy.visit(`/trial-session-detail/${createdTrialSessionId}`);

          cy.get('[data-testid="irs-calendar-admin-info-name"]').should(
            'have.text',
            'Nero West',
          );
          cy.get('[data-testid="irs-calendar-admin-info-email"]').should(
            'have.text',
            'irspractitioner2@example.com',
          );
          cy.get('[data-testid="irs-calendar-admin-info-phone"]').should(
            'have.text',
            '+1 (555) 555-5555',
          );

          cy.get(`[data-testid="${docketNumber}-complete"]:checked`).should(
            'not.exist',
          );
          cy.get(`label[for="${docketNumber}-complete"]`).click();
          cy.get(`[data-testid="${docketNumber}-complete"]:checked`).should(
            'exist',
          );
          cy.get('#set-calendar-button').click();
          cy.get('#modal-button-confirm').click();
          cy.url().should('include', 'print-paper-trial-notices');
          cy.get('[data-testid="printing-complete"]').click();
          cy.url().should(
            'include',
            `trial-session-detail/${createdTrialSessionId}`,
          );
          cy.visit(`/edit-trial-session/${createdTrialSessionId}`);
          cy.get('[data-testid="trial-session-judge"]').select('Colvin');
          cy.get('[data-testid="submit-edit-trial-session"]').click();
          cy.url().should('include', 'print-paper-trial-notices');
          cy.get('[data-testid="printing-complete"]').click();
          cy.url().should(
            'include',
            `trial-session-detail/${createdTrialSessionId}`,
          );
          cy.get(
            '[data-testid="trial-session-open-paper-service-pdfs"]',
          ).click();
          cy.get('[data-testid="trial-session-paper-pdf-options"]').contains(
            'Initial Calendaring',
          );
          cy.get('[data-testid="trial-session-paper-pdf-options"]').contains(
            'Notice of Change of Trial Judge',
          );
        });
      },
    );
  });
});
