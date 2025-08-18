import { loginAsDocketClerk, loginAsPetitionsClerk1 } from "cypress/helpers/authentication/login-as-helpers";
import { createAndServePaperPetition } from "cypress/helpers/fileAPetition/create-and-serve-paper-petition";
import { createTrialSession } from "cypress/helpers/trialSession/create-trial-session";

describe('Sealed Contact Information', () => {
    before(() => {
        loginAsPetitionsClerk1();
        createTrialSession().then(({trialSessionId}) => {
            Cypress.env('trialSessionId', trialSessionId);
            createAndServePaperPetition().then(({ docketNumber }) => {
                Cypress.env('docketNumber', docketNumber);
                
            });
        })
    });
    it('displays correct seal information text', () => {
        loginAsDocketClerk();
        cy.visit(`case-detail/${Cypress.env('docketNumber')}`);
        cy.get('[data-testid="tab-case-information"]').click();
        cy.get('[data-testid="tab-parties"]').click();
        cy.get('[data-testid="edit-petitioner-button"]').click();
        cy.get('[data-testid="seal-address-label"]').contains('Seal contact information');
        cy.get('[data-testid="seal-address-label"]').click();
        cy.get('[data-testid="confirm-modal-header"]').contains(`Seal The Following Information for`);
        cy.get('[data-testid="seal-address-modal-address-1"]').contains('some random street');
        cy.get('[data-testid="seal-address-modal-address-city-state-zip"]').contains('cleveland, TN 33333');
        cy.get('[data-testid="seal-address-modal-phone"]').contains('n/a');
        cy.get('[data-testid="seal-address-modal-email"]').contains('Not Provided');
        cy.get('[data-testid="seal-address-modal-address-petition-email"]').contains('Not Provided');
        cy.get('[data-testid="confirm-modal-close-btn"]').click();
    });
});