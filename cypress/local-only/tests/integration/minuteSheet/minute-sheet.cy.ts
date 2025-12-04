import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import {
  loginAsColvinChambers,
  loginAsDocketClerk1,
  loginAsPetitionsClerk1,
} from 'cypress/helpers/authentication/login-as-helpers';
import { updateCaseStatus } from 'cypress/helpers/caseDetail/caseInformation/update-case-status';
import { goToCase } from 'cypress/helpers/caseDetail/go-to-case';
import { createAndServePaperPetition } from 'cypress/helpers/fileAPetition/create-and-serve-paper-petition';
import { calendarTrialSession } from 'cypress/helpers/trialSession/calendar-trial-session';
import { createTrialSession } from 'cypress/helpers/trialSession/create-trial-session';
import { scheduleTrialSession } from 'cypress/helpers/trialSession/schedule-trial-session';

describe('user opens a minute sheet', () => {
  beforeEach(() => {
    loginAsPetitionsClerk1();
    createTrialSession().then(({ trialSessionId }) => {
      cy.wrap(trialSessionId).as('trialSessionId');
      createAndServePaperPetition().then(({ docketNumber }) => {
        cy.wrap(docketNumber).as('docketNumber');
        loginAsDocketClerk1();
        goToCase(docketNumber);
        updateCaseStatus(CASE_STATUS_TYPES.generalDocketReadyForTrial);
        calendarTrialSession(trialSessionId);
        scheduleTrialSession(docketNumber, trialSessionId);
        loginAsColvinChambers();
        cy.get('[data-testid="trial-session-link"]').click();
        cy.get(`[data-testid="trial-location-link-${trialSessionId}"]`).click();
        cy.get(`[data-testid="minute-sheet-button-${docketNumber}"]`)
          .invoke('removeAttr', 'target')
          .click();
      });
    });
  });

  it('should preview the minute sheet', () => {
    // opens expected url in new tab
    cy.window().then(win => {
      cy.stub(win, 'open')
        .callsFake((url, target) => {
          expect(target).to.equal('_blank');
          const hasPdf =
            url.includes('.pdf') ||
            url.includes('%2Epdf') ||
            url.includes('.pdf%22');
          expect(hasPdf).to.equal(true);
        })
        .as('windowOpen');
    });

    cy.get('[data-testid="preview-pdf-button-top"]').click();
  });

  it('should save minute sheet to drafts', () => {
    cy.get('[data-testid="save-to-drafts-button-top"]').click();
    cy.get('[data-testid="success-alert"]').should(
      'contain',
      'Minutes PDF saved to case Drafts.',
    );
    cy.get<string>('@docketNumber').then(docketNumber => {
      goToCase(docketNumber);
      cy.get('[data-testid="tab-drafts"]').click();
      cy.get('button:contains(Minutes)').last().should('exist');
    });
  });

  it('should redirect back to trial session if back to trial session button is clicked', () => {
    cy.get('[data-testid="back-to-trial-session-btn"]')
      .invoke('removeAttr', 'target')
      .click();
    cy.get<string>('@trialSessionId').then(trialSessionId => {
      cy.url().should('include', `/trial-session-detail/${trialSessionId}`);
    });
  });

  it('should add exhibit under the exhibit button clicked', () => {
    // remove all exhibits that currently exist
    cy.get('[data-testid^="remove-exhibit-button-"]').each($el => {
      cy.wrap($el).click();
    });

    cy.get('[data-testid="add-exhibit-button-empty"]').click();

    // add 2 more rows so there are 3 rows and put values in each exhibit
    cy.get('[data-testid="add-exhibit-button-0"]').click();
    cy.get('[data-testid="add-exhibit-button-0"]').click();
    cy.get('[data-testid="exhibit-description-0"]').type('a');
    cy.get('[data-testid="exhibit-description-1"]').type('b');
    cy.get('[data-testid="exhibit-description-2"]').type('c');

    cy.get('[data-testid="add-exhibit-button-0"]').click();
    cy.get('[data-testid="add-exhibit-button-2"]').click();
    cy.get('[data-testid="exhibit-description-0"]').should('have.value', 'a');
    cy.get('[data-testid="exhibit-description-1"]').should('be.empty');
    cy.get('[data-testid="exhibit-description-2"]').should('have.value', 'b');
    cy.get('[data-testid="exhibit-description-3"]').should('be.empty');
    cy.get('[data-testid="exhibit-description-4"]').should('have.value', 'c');
  });
});
