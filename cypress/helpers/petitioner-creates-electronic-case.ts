import { attachDummyFile } from './attach-file';

export function petitionerCreatesEletronicCaseWithDeseasedSpouse(
  primaryFilerName = 'John',
  secondaryFilerName = 'Sally',
) {
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();
  attachDummyFile('stin-file');
  cy.get('[data-testid="complete-step-1"]').click();
  attachDummyFile('petition-file');
  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="case-type-select"]').select('Notice of Deficiency');
  cy.get('[data-testid="complete-step-2"]').click();
  cy.get('[data-testid="filing-type-1"]').click();
  cy.get('[data-testid="is-spouse-deceased-1"]').click();
  cy.get('[data-testid="modal-confirm"]').click();
  cy.get('[data-testid="contact-primary-name"]').type(primaryFilerName);
  cy.get('[data-testid="contact-secondary-name"]').type(secondaryFilerName);
  cy.get('[data-testid="contactPrimary.address1"]').type('111 South West St.');
  cy.get('[data-testid="contactPrimary.city"]').type('Orlando');
  cy.get('[data-testid="contactPrimary.state"]').select('AL');
  cy.get('[data-testid="contactPrimary.postalCode"]').type('12345');
  cy.get('[data-testid="phone"]').type('1111111111');
  cy.get('[data-testid="use-same-address-above-label"]').click();
  cy.get('[data-testid="complete-step-3"]').click();
  cy.get('[data-testid="procedure-type-1"]').click();
  cy.get('[data-testid="procedure-type-0"]').click();
  cy.get('[data-testid="preferred-trial-city"]').select('Mobile, Alabama');
  cy.get('[data-testid="complete-step-4"]').click();
  cy.get('[data-testid="file-petition"]').click();
  return cy
    .get('[data-testid="docket-number-with-suffix"]')
    .invoke('text')
    .then(docketNumberWithSuffix => {
      cy.get('[data-testid="button-back-to-dashboard"]').click();
      return cy.wrap<string>(docketNumberWithSuffix);
    });
}

export function petitionerCreatesEletronicCase({
  atpFilesToAttach = [],
  primaryFilerName = 'John',
}: {
  atpFilesToAttach?: string[];
  primaryFilerName?: string;
} = {}) {
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();
  attachDummyFile('stin-file');
  cy.get('[data-testid="complete-step-1"]').click();
  attachDummyFile('petition-file');
  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="case-type-select"]').select('Notice of Deficiency');
  cy.get('[data-testid="atp-files-upload"]').attachFile(atpFilesToAttach);

  cy.get('[data-testid="complete-step-2"]').click();
  cy.get('[data-testid="filing-type-0"]').click();

  cy.get('[data-testid="contact-primary-name"]').type(primaryFilerName);
  cy.get('[data-testid="contactPrimary.address1"]').type('111 South West St.');
  cy.get('[data-testid="contactPrimary.city"]').type('Orlando');
  cy.get('[data-testid="contactPrimary.state"]').select('AL');
  cy.get('[data-testid="contactPrimary.postalCode"]').type('12345');
  cy.get('[data-testid="phone"]').type('1111111111');

  cy.get('[data-testid="complete-step-3"]').click();
  cy.get('[data-testid="procedure-type-1"]').click();
  cy.get('[data-testid="procedure-type-0"]').click();
  cy.get('[data-testid="preferred-trial-city"]').select('Mobile, Alabama');
  cy.get('[data-testid="complete-step-4"]').click();

  // Review Page
  cy.get('[data-testid="attachment-to-petition-pdfs"]').should(
    'have.length',
    atpFilesToAttach.length,
  );
  cy.get('[data-testid="stin-preview-button"]').should('exist');
  cy.get('[data-testid="petition-preview-button"]').should('exist');

  cy.get('[data-testid="file-petition"]').click();
  return cy
    .get('[data-testid="docket-number-with-suffix"]')
    .invoke('text')
    .then(docketNumberWithSuffix => {
      cy.get('[data-testid="button-back-to-dashboard"]').click();
      return cy.wrap<string>(docketNumberWithSuffix);
    });
}
