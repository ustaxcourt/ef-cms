import { petitionerCreatesElectronicCaseUpdated } from './petitioner-creates-electronic-case-updated';
import { uploadFile } from '../file/upload-file';

export function petitionerCreatesElectronicCaseWithDeceasedSpouse(
  primaryFilerName = 'John',
  secondaryFilerName = 'Sally',
) {
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();
  uploadFile('stin-file');
  cy.get('[data-testid="complete-step-1"]').click();
  uploadFile('petition-file');
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

export function petitionerCreatesElectronicCase(primaryFilerName = 'John') {
  return cy
    .task('getFeatureFlagValue', { flag: 'updated-petition-flow' })
    .then(updatedFlow => {
      if (updatedFlow) {
        return petitionerCreatesElectronicCaseUpdated(primaryFilerName);
      } else {
        return petitionerCreatesElectronicCaseOld(primaryFilerName);
      }
    });
}

function petitionerCreatesElectronicCaseOld(primaryFilerName = 'John') {
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();
  uploadFile('stin-file');
  cy.get('[data-testid="complete-step-1"]').click();
  uploadFile('petition-file');
  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="case-type-select"]').select('Notice of Deficiency');
  uploadFile('atp-file-upload');

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

  cy.get('[data-testid="stin-preview-button"]').should('exist');
  cy.get('[data-testid="petition-preview-button"]').should('exist');
  cy.get('[data-testid="atp-preview-button"]').should('exist');

  cy.get('[data-testid="file-petition"]').click();
  return cy
    .get('[data-testid="docket-number-with-suffix"]')
    .invoke('text')
    .then(docketNumberWithSuffix => {
      cy.get('[data-testid="button-back-to-dashboard"]').click();
      return cy.wrap<string>(docketNumberWithSuffix);
    });
}

export function petitionerCreatesElectronicCaseForBusiness() {
  return cy
    .task('getFeatureFlagValue', { flag: 'updated-petition-flow' })
    .then(updatedFlow => {
      if (updatedFlow) {
        return petitionerCreatesElectronicCaseForBusinessUpdated();
      } else {
        return petitionerCreatesElectronicCaseForBusinessOld();
      }
    });
}

export function petitionerCreatesElectronicCaseForBusinessOld() {
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();
  uploadFile('stin-file');
  cy.get('[data-testid="complete-step-1"]').click();
  uploadFile('petition-file');
  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="case-type-select"]').select('Notice of Deficiency');
  uploadFile('atp-file-upload');

  cy.get('[data-testid="complete-step-2"]').click();

  cy.get('[data-testid="filing-type-2"]').click();
  cy.get('#is-business-type-0').click();
  cy.get('#businessType-Corporation').check();
  cy.get('[data-testid="contact-primary-name"]').type('Business Test Name');
  cy.get('[data-testid="contactPrimary.address1"]').type('Some Random Street');
  cy.get('[data-testid="contactPrimary.city"]').type('Bouler');
  cy.get('[data-testid="contactPrimary.state"]').select('CO');
  cy.get('[data-testid="contactPrimary.postalCode"]').type('32154');
  cy.get('[data-testid="phone"]').type('123456789');

  uploadFile('corporate-disclosure-file');

  cy.get('[data-testid="complete-step-3"]').click();
  cy.get('[data-testid="procedure-type-1"]').click();
  cy.get('[data-testid="procedure-type-0"]').click();
  cy.get('[data-testid="preferred-trial-city"]').select('Mobile, Alabama');
  cy.get('[data-testid="complete-step-4"]').click();

  cy.get('[data-testid="stin-preview-button"]').should('exist');
  cy.get('[data-testid="petition-preview-button"]').should('exist');
  cy.get('[data-testid="atp-preview-button"]').should('exist');

  cy.get('[data-testid="file-petition"]').click();
  return cy
    .get('[data-testid="docket-number-with-suffix"]')
    .invoke('text')
    .then(docketNumberWithSuffix => {
      cy.get('[data-testid="button-back-to-dashboard"]').click();
      return cy.wrap<string>(docketNumberWithSuffix);
    });
}

export function petitionerCreatesElectronicCaseForBusinessUpdated() {
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();
  cy.get('[data-testid="filing-type-2"]').click();
  cy.get('#is-business-type-0').click();
  cy.get('[data-testid="contact-primary-name"]').type('awd');
  cy.get('[data-testid="contactPrimary.address1"]').type('awd');
  cy.get('[data-testid="contactPrimary.city"]').type('awd');
  cy.get('[data-testid="contactPrimary.state"]').select('AK');
  cy.get('[data-testid="contactPrimary.postalCode"]').type('12312');
  cy.get('[data-testid="contact-primary-phone"]').type('awd');
  uploadFile('corporate-disclosure-file');

  cy.get('[data-testid="step-1-next-button"]').click();
  cy.get('[data-testid="petition-reason--1"]').type('aws');
  cy.get('[data-testid="petition-fact--1"]').type('aws');
  cy.get('[data-testid="step-2-next-button"]').click();

  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="irs-notice-upload-0"]').click();
  uploadFile('irs-notice-upload-0');
  cy.get('[data-testid="case-type-select"]').select('Deficiency');
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="step-3-next-button"]').click();

  cy.get('[data-testid="preferred-trial-city"]').select('Birmingham, Alabama');
  cy.get('[data-testid="step-4-next-button"]').click();

  cy.get('[data-testid="stin-file"]').click();
  uploadFile('stin-file');
  cy.get('[data-testid="step-5-next-button"]').click();

  cy.get('[data-testid="step-6-next-button"]').click();

  return cy
    .get('[data-testid="case-link-docket-number"]')
    .invoke('text')
    .then(docketNumberWithSuffix => {
      cy.get('[data-testid="case-link"]').click();
      return cy.wrap<string>(docketNumberWithSuffix);
    });
}

export function privatePractitionerCreatesElectronicCaseForBusiness() {
  return cy
    .task('getFeatureFlagValue', { flag: 'updated-petition-flow' })
    .then(updatedFlow => {
      if (updatedFlow) {
        return petitionerCreatesElectronicCaseForBusinessUpdated();
      } else {
        return petitionerCreatesElectronicCaseForBusinessOld();
      }
    });
}

export function privatePractitionerCreatesElectronicCaseForBusiness() {
  cy.get('[data-testid="file-a-petition"]').click();
  uploadFile('stin-file');
  cy.get('[data-testid="complete-step-1"]').click();
  uploadFile('petition-file');
  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="case-type-select"]').select('Notice of Deficiency');
  uploadFile('atp-file-upload');

  cy.get('[data-testid="complete-step-2"]').click();

  cy.get('[data-testid="filing-type-2"]').click();
  cy.get('#is-business-type-0').click();
  cy.get('#businessType-Corporation').check();
  cy.get('[data-testid="contact-primary-name"]').type('Business Test Name');
  cy.get('[data-testid="contactPrimary.address1"]').type('Some Random Street');
  cy.get('[data-testid="contactPrimary.city"]').type('Bouler');
  cy.get('[data-testid="contactPrimary.state"]').select('CO');
  cy.get('[data-testid="contactPrimary.postalCode"]').type('32154');
  cy.get('[data-testid="phone"]').type('123456789');

  uploadFile('corporate-disclosure-file');

  cy.get('[data-testid="complete-step-3"]').click();
  cy.get('[data-testid="procedure-type-1"]').click();
  cy.get('[data-testid="procedure-type-0"]').click();
  cy.get('[data-testid="preferred-trial-city"]').select('Mobile, Alabama');
  cy.get('[data-testid="complete-step-4"]').click();

  cy.get('[data-testid="stin-preview-button"]').should('exist');
  cy.get('[data-testid="petition-preview-button"]').should('exist');
  cy.get('[data-testid="atp-preview-button"]').should('exist');

  cy.get('[data-testid="file-petition"]').click();
  return cy
    .get('[data-testid="docket-number-with-suffix"]')
    .invoke('text')
    .then(docketNumberWithSuffix => {
      cy.get('[data-testid="button-back-to-dashboard"]').click();
      return cy.wrap<string>(docketNumberWithSuffix);
    });
}

export function petitionerAttemptsToUploadCorruptPdf() {
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();
  cy.get('[data-testid="stin-file"]').attachFile(
    '../../helpers/file/corrupt-pdf.pdf',
  );
  cy.get('[data-testid="complete-step-1"]').click();
  uploadFile('petition-file');
  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="case-type-select"]').select('Notice of Deficiency');
  uploadFile('atp-file-upload');

  cy.get('[data-testid="complete-step-2"]').click();
  cy.get('[data-testid="filing-type-0"]').click();

  cy.get('[data-testid="contact-primary-name"]').type('John');
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

  cy.get('[data-testid="stin-preview-button"]').should('exist');
  cy.get('[data-testid="petition-preview-button"]').should('exist');
  cy.get('[data-testid="atp-preview-button"]').should('exist');

  cy.get('[data-testid="file-petition"]').click();

  cy.get('[data-testid="modal-dialog"]').should('exist');
  cy.get('[data-testid="modal-dialog-header"]').should(
    'contain.text',
    'Your Request Was Not Completed',
  );
}
