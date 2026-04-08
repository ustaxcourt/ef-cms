import { goToCase } from '../go-to-case';

export const addPrivatePractitionerToCaseAndAllParties = (
  docketNumber: string,
  barNumber: string,
  representing: number[] = [],
) => {
  cy.intercept('GET', `/cases/${docketNumber}`).as('caseDetails');
  goToCase(docketNumber);

  // defaults to represent all if not specified
  cy.wait('@caseDetails').then(interception => {
    if (representing.length === 0) {
      cy.wrap(
        interception.response?.body.petitioners.map(
          (_: any, index: number) => index,
        ),
      ).as('partiesRepresenting');
    }
  });
  cy.get('[data-testid="tab-case-information"]').click();
  cy.get('[data-testid="tab-parties"]').click();
  cy.get('[data-testid="practitioner-search-input"]').clear();
  cy.get('[data-testid="practitioner-search-input"]').type(barNumber);
  cy.get('.usa-search__submit-text').click();
  cy.then(() => {
    if (representing.length > 0) {
      representing.forEach(index => {
        cy.get(`[data-testid="practitioner-representing-${index}"]`).click();
      });
    } else {
      cy.get<number[]>('@partiesRepresenting').then(partiesRepresenting => {
        partiesRepresenting.forEach(index => {
          cy.get(`[data-testid="practitioner-representing-${index}"]`).click();
        });
      });
    }
  });
  cy.get('[data-testid="modal-button-confirm"]').click();
};
