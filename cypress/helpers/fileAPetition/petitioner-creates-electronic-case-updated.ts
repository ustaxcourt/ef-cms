import { uploadFile } from '../file/upload-file';

export function petitionerCreatesElectronicCaseUpdated(
  primaryFilerName = 'John',
) {
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();

  cy.get('[data-testid="filing-type-0"]').click();
  cy.get('[data-testid="contact-primary-name"]').type(primaryFilerName);
  cy.get('[data-testid="contactPrimary.address1"]').type('111 South West St.');
  cy.get('[data-testid="contactPrimary.city"]').type('Orlando');
  cy.get('[data-testid="contactPrimary.state"]').select('AL');
  cy.get('[data-testid="contactPrimary.postalCode"]').type('12345');
  cy.get('[data-testid="contactPrimary.placeOfLegalResidence"]').select('AL');
  cy.get('[data-testid="contact-primary-phone"]').type('1111111111');
  cy.get('[data-testid="step-1-next-button"]').click();

  cy.get('[data-testid="petition-reason--1"]').type('First reason goes here');
  cy.get('[data-testid="petition-fact--1"]').type('First fact goes here');
  cy.get('[data-testid="step-2-next-button"]').click();

  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="case-type-select"]').select('Notice of Deficiency');
  uploadFile('irs-notice-upload-0');
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="step-3-next-button"]').click();

  cy.get('[data-testid="procedure-type-1"]').click();
  cy.get('[data-testid="procedure-type-0"]').click();
  cy.get('[data-testid="preferred-trial-city"]').select('Mobile, Alabama');
  cy.get('[data-testid="step-4-next-button"]').click();

  uploadFile('stin-file');
  cy.get('[data-testid="step-5-next-button"]').click();

  cy.get('[data-testid="stin-preview-button"]').should('exist');
  cy.get('[data-testid="petition-pdf-preview"]').should('exist');
  cy.get('[data-testid="atp-preview-button"]').should('exist');

  cy.get('[data-testid="step-6-next-button"]').click();

  return cy
    .get('[data-testid="case-link-docket-number"]')
    .invoke('text')
    .then(docketNumberWithSuffix => {
      cy.get('[data-testid="case-link"]').click();
      return cy.wrap<string>(docketNumberWithSuffix);
    });
}
