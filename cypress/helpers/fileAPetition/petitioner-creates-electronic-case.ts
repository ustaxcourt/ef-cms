import { PROCEDURE_TYPES_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { attachSamplePdfFile } from '../file/upload-file';

export function petitionerCreatesElectronicCase(
  primaryFilerName: string = 'John',
) {
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();

  cy.get('[data-testid="filing-type-0"]').click();
  cy.get('[data-testid="contact-primary-name"]').type(primaryFilerName);
  cy.get('[data-testid="contactPrimary.address1"]').type('111 South West St.');
  cy.get('[data-testid="contactPrimary.city"]').type('Orlando');
  cy.get('[data-testid="contactPrimary.state"]').select('AL');
  cy.get('[data-testid="contactPrimary.postalCode"]').type('12345');
  cy.get('[data-testid="contactPrimary-placeOfLegalResidence"]').select('AL');
  cy.get('[data-testid="contact-primary-phone"]').type('1111111111');
  cy.get('[data-testid="step-1-next-button"]').click();

  cy.get('[data-testid="petition-reason--1"]').type('First reason goes here');
  cy.get('[data-testid="petition-fact--1"]').type('First fact goes here');
  cy.get('[data-testid="step-2-next-button"]').click();

  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="case-type-select"]').select('Notice of Deficiency');
  attachSamplePdfFile('irs-notice-upload-0');
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="step-3-next-button"]').click();

  cy.get(
    `[data-testid="procedure-type-${PROCEDURE_TYPES_MAP.regular}-radio"]`,
  ).click();
  cy.get('[data-testid="preferred-trial-city"]').select('Mobile, Alabama');
  cy.get('[data-testid="step-4-next-button"]').click();

  attachSamplePdfFile('stin-file');
  cy.get('[data-testid="step-5-next-button"]').click();

  cy.get('[data-testid="atp-preview-button"]').should('exist');
  cy.get('[data-testid="stin-preview-button"]').should('exist');

  cy.get('[data-testid="step-6-next-button"]').click();

  return cy
    .get('[data-testid="case-link-docket-number"]')
    .invoke('text')
    .then(docketNumberWithSuffix => {
      cy.get('[data-testid="button-back-to-dashboard"]').click();
      return cy.wrap<string>(docketNumberWithSuffix);
    });
}

export function petitionerCreatesElectronicCaseWithDeceasedSpouse(
  primaryFilerName: string = 'John',
  secondaryFilerName: string = 'Sally',
) {
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();

  cy.get('[data-testid="filing-type-1"]').click();
  cy.get('[data-testid="is-spouse-deceased-0"]').click();
  cy.get('[data-testid="contact-primary-name"]').type(primaryFilerName);
  cy.get('[data-testid="contact-secondary-name"]').type(secondaryFilerName);
  cy.get('[data-testid="contactSecondary-in-care-of"]').type('in care of');
  cy.get('[data-testid="contactPrimary.address1"]').type('111 South West St.');
  cy.get('[data-testid="contactPrimary.city"]').type('Orlando');
  cy.get('[data-testid="contactPrimary.state"]').select('AL');
  cy.get('[data-testid="contactPrimary.postalCode"]').type('12345');
  cy.get('[data-testid="contact-primary-phone"]').type('1111111111');
  cy.get('[data-testid="step-1-next-button"]').click();

  cy.get('[data-testid="petition-reason--1"]').type('First reason goes here');
  cy.get('[data-testid="petition-fact--1"]').type('First fact goes here');
  cy.get('[data-testid="step-2-next-button"]').click();

  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="case-type-select"]').select('Notice of Deficiency');
  attachSamplePdfFile('irs-notice-upload-0');
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="step-3-next-button"]').click();

  cy.get(
    `[data-testid="procedure-type-${PROCEDURE_TYPES_MAP.regular}-radio"]`,
  ).click();
  cy.get('[data-testid="preferred-trial-city"]').select('Mobile, Alabama');
  cy.get('[data-testid="step-4-next-button"]').click();

  attachSamplePdfFile('stin-file');
  cy.get('[data-testid="step-5-next-button"]').click();

  cy.get('[data-testid="atp-preview-button"]').should('exist');
  cy.get('[data-testid="stin-preview-button"]').should('exist');

  cy.get('[data-testid="step-6-next-button"]').click();

  return cy
    .get('[data-testid="case-link-docket-number"]')
    .invoke('text')
    .then(docketNumberWithSuffix => {
      cy.get('[data-testid="case-link"]').click();
      return cy.wrap<string>(docketNumberWithSuffix);
    });
}

export function petitionerCreatesElectronicCaseWithSpouse(
  primaryFilerName: string = 'John',
  secondaryFilerName: string = 'Sally',
) {
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();

  cy.get('[data-testid="filing-type-1"]').click();
  cy.get('[data-testid="is-spouse-deceased-1"]').click();
  cy.get('[data-testid="have-spouse-consent-label"]').click();
  cy.get('[data-testid="contact-primary-name"]').type(primaryFilerName);
  cy.get('[data-testid="contact-secondary-name"]').type(secondaryFilerName);
  cy.get('[data-testid="contactPrimary.address1"]').type('111 South West St.');
  cy.get('[data-testid="contactPrimary.city"]').type('Orlando');
  cy.get('[data-testid="contactPrimary.state"]').select('AL');
  cy.get('[data-testid="contactPrimary.postalCode"]').type('12345');
  cy.get('[data-testid="contact-primary-phone"]').type('1111111111');
  cy.get('[data-testid="step-1-next-button"]').click();

  cy.get('[data-testid="petition-reason--1"]').type('First reason goes here');
  cy.get('[data-testid="petition-fact--1"]').type('First fact goes here');
  cy.get('[data-testid="step-2-next-button"]').click();

  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="case-type-select"]').select('Notice of Deficiency');
  attachSamplePdfFile('irs-notice-upload-0');
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="step-3-next-button"]').click();

  cy.get(
    `[data-testid="procedure-type-${PROCEDURE_TYPES_MAP.regular}-radio"]`,
  ).click();
  cy.get('[data-testid="preferred-trial-city"]').select('Mobile, Alabama');
  cy.get('[data-testid="step-4-next-button"]').click();

  attachSamplePdfFile('stin-file');
  cy.get('[data-testid="step-5-next-button"]').click();

  cy.get('[data-testid="atp-preview-button"]').should('exist');
  cy.get('[data-testid="stin-preview-button"]').should('exist');

  cy.get('[data-testid="step-6-next-button"]').click();

  return cy
    .get('[data-testid="case-link-docket-number"]')
    .invoke('text')
    .then(docketNumberWithSuffix => {
      cy.get('[data-testid="case-link"]').click();
      return cy.wrap<string>(docketNumberWithSuffix);
    });
}

export function petitionerCreatesElectronicCaseForBusiness() {
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();
  cy.get('[data-testid="filing-type-2"]').click();
  cy.get('[data-testid="business-type-0"]').click();
  cy.get('[data-testid="contact-primary-name"]').type('The Fifth Business');
  cy.get('[data-testid="contactPrimary.address1"]').type('Some Random Street');
  cy.get('[data-testid="contactPrimary.city"]').type('Boulder');
  cy.get('[data-testid="contactPrimary.state"]').select('CO');
  cy.get('[data-testid="contactPrimary.postalCode"]').type('12345');
  cy.get('[data-testid="contact-primary-phone"]').type('123456789');
  attachSamplePdfFile('corporate-disclosure-file');
  cy.get('[data-testid="step-1-next-button"]').click();

  cy.get('[data-testid="upload-a-petition-label"]').click();
  attachSamplePdfFile('petition-file');
  cy.get('[data-testid="petition-redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="step-2-next-button"]').click();

  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="case-type-select"]').select('Deficiency');
  cy.get('[data-testid="irs-notice-tax-year-0"]').type('2020');
  cy.get('[data-testid="city-and-state-issuing-office-0"]').type('Boulder, CO');
  attachSamplePdfFile('irs-notice-upload-0');
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="step-3-next-button"]').click();

  cy.get('[data-testid="preferred-trial-city"]').select('Mobile, Alabama');
  cy.get('[data-testid="step-4-next-button"]').click();

  attachSamplePdfFile('stin-file');
  cy.get('[data-testid="step-5-next-button"]').click();

  cy.get('[data-testid="stin-preview-button"]').should('exist');
  cy.get('[data-testid="petition-preview-button"]').should('exist');
  cy.get('[data-testid="atp-preview-button"]').should('exist');
  cy.get('[data-testid="step-6-next-button"]').click();

  return cy
    .get('[data-testid="case-link-docket-number"]')
    .invoke('text')
    .then(docketNumberWithSuffix => {
      cy.get('[data-testid="button-back-to-dashboard"]').click();
      return cy.wrap<string>(docketNumberWithSuffix);
    });
}

export function petitionerAttemptsToUploadCorruptPdf() {
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();

  cy.get('[data-testid="filing-type-0"]').click();
  cy.get('[data-testid="contact-primary-name"]').type('John the Corrupt');
  cy.get('[data-testid="contactPrimary.address1"]').type('111 South West St.');
  cy.get('[data-testid="contactPrimary.city"]').type('Orlando');
  cy.get('[data-testid="contactPrimary.state"]').select('AL');
  cy.get('[data-testid="contactPrimary.postalCode"]').type('12345');
  cy.get('[data-testid="contactPrimary-placeOfLegalResidence"]').select('AL');
  cy.get('[data-testid="contact-primary-phone"]').type('1111111111');
  cy.get('[data-testid="step-1-next-button"]').click();

  cy.get('[data-testid="petition-reason--1"]').type('First reason goes here');
  cy.get('[data-testid="petition-fact--1"]').type('First fact goes here');
  cy.get('[data-testid="step-2-next-button"]').click();

  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="case-type-select"]').select('Notice of Deficiency');
  attachSamplePdfFile('irs-notice-upload-0');
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="step-3-next-button"]').click();

  cy.get(
    `[data-testid="procedure-type-${PROCEDURE_TYPES_MAP.regular}-radio"]`,
  ).click();
  cy.get('[data-testid="preferred-trial-city"]').select('Mobile, Alabama');
  cy.get('[data-testid="step-4-next-button"]').click();

  cy.get('[data-testid="stin-file"]').attachFile(
    '../../helpers/file/corrupt-pdf.pdf',
  );
  cy.get('[data-testid="step-5-next-button"]').click();

  cy.get('[data-testid="atp-preview-button"]').should('exist');
  cy.get('[data-testid="stin-preview-button"]').should('exist');

  cy.get('[data-testid="step-6-next-button"]').click();

  cy.get('[data-testid="modal-dialog"]').should('exist');
  cy.get('[data-testid="modal-dialog-header"]').should(
    'contain.text',
    'Your Request Was Not Completed',
  );
}
