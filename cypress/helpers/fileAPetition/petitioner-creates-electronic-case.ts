import { attachFile } from '../file/upload-file';
import { attachSamplePdfFile } from '../file/upload-file';

import { PROCEDURE_TYPES_MAP } from '../../../shared/src/business/entities/EntityConstants';
import {
  petitionerAttemptsToUploadCorruptPdfUpdated,
  petitionerCreatesElectronicCaseForBusinessUpdated,
  petitionerCreatesElectronicCaseUpdated,
  petitionerCreatesElectronicCaseWithDeceasedSpouseUpdated,
  petitionerCreatesElectronicCaseWithSpouseUpdated,
} from './petitioner-creates-electronic-case-updated';

export function petitionerCreatesElectronicCaseWithDeceasedSpouseOld(
  primaryFilerName = 'John',
  secondaryFilerName = 'Sally',
) {
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();
  attachSamplePdfFile('stin-file');
  cy.get('[data-testid="complete-step-1"]').click();
  attachSamplePdfFile('petition-file');
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
  cy.get(
    `[data-testid="procedure-type-${PROCEDURE_TYPES_MAP.regular}-radio"]`,
  ).click();
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

export function petitionerCreatesElectronicCaseWithDeceasedSpouse(
  primaryFilerName: string = 'John',
  secondaryFilerName: string = 'Sally',
) {
  return cy
    .task('getFeatureFlagValue', { flag: 'updated-petition-flow' })
    .then(updatedFlow => {
      if (updatedFlow) {
        return petitionerCreatesElectronicCaseWithDeceasedSpouseUpdated(
          primaryFilerName,
          secondaryFilerName,
        );
      } else {
        return petitionerCreatesElectronicCaseWithDeceasedSpouseOld(
          primaryFilerName,
          secondaryFilerName,
        );
      }
    });
}

export function petitionerCreatesElectronicCaseWithSpouse(
  primaryFilerName: string = 'John',
  secondaryFilerName: string = 'Sally',
) {
  return cy
    .task('getFeatureFlagValue', { flag: 'updated-petition-flow' })
    .then(updatedFlow => {
      if (updatedFlow) {
        return petitionerCreatesElectronicCaseWithSpouseUpdated(
          primaryFilerName,
          secondaryFilerName,
        );
      } else {
        return petitionerCreatesElectronicCaseWithSpouseOld(
          primaryFilerName,
          secondaryFilerName,
        );
      }
    });
}

export function petitionerCreatesElectronicCaseWithSpouseOld(
  primaryFilerName = 'John',
  secondaryFilerName = 'Sally',
) {
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();
  attachSamplePdfFile('stin-file');
  cy.get('[data-testid="complete-step-1"]').click();
  attachSamplePdfFile('petition-file');
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
  cy.get(
    `[data-testid="procedure-type-${PROCEDURE_TYPES_MAP.regular}-radio"]`,
  ).click();
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

export function petitionerCreatesElectronicCase(
  primaryFilerName: string = 'John',
) {
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
  attachSamplePdfFile('stin-file');
  cy.get('[data-testid="complete-step-1"]').click();
  attachSamplePdfFile('petition-file');
  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="case-type-select"]').select('Notice of Deficiency');
  attachSamplePdfFile('atp-file-upload');

  cy.get('[data-testid="complete-step-2"]').click();
  cy.get('[data-testid="filing-type-0"]').click();

  cy.get('[data-testid="contact-primary-name"]').type(primaryFilerName);
  cy.get('[data-testid="contactPrimary.address1"]').type('111 South West St.');
  cy.get('[data-testid="contactPrimary.city"]').type('Orlando');
  cy.get('[data-testid="contactPrimary.state"]').select('AL');
  cy.get('[data-testid="contactPrimary.postalCode"]').type('12345');
  cy.get('[data-testid="phone"]').type('1111111111');

  cy.get('[data-testid="complete-step-3"]').click();
  cy.get(
    `[data-testid="procedure-type-${PROCEDURE_TYPES_MAP.regular}-radio"]`,
  ).click();
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

export function petitionerCreatesElectronicCaseForBusinessOld() {
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();
  attachSamplePdfFile('stin-file');
  cy.get('[data-testid="complete-step-1"]').click();
  attachSamplePdfFile('petition-file');
  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="case-type-select"]').select('Notice of Deficiency');
  attachSamplePdfFile('atp-file-upload');

  cy.get('[data-testid="complete-step-2"]').click();

  cy.get('[data-testid="filing-type-2"]').click();
  cy.get('#is-business-type-0').click();
  cy.get('#businessType-Corporation').check();
  cy.get('[data-testid="contact-primary-name"]').type('Business Test Name');
  cy.get('[data-testid="contactPrimary.address1"]').type('Some Random Street');
  cy.get('[data-testid="contactPrimary.city"]').type('Boulder');
  cy.get('[data-testid="contactPrimary.state"]').select('CO');
  cy.get('[data-testid="contactPrimary.postalCode"]').type('32154');
  cy.get('[data-testid="phone"]').type('123456789');

  attachSamplePdfFile('corporate-disclosure-file');

  cy.get('[data-testid="complete-step-3"]').click();
  cy.get(
    `[data-testid="procedure-type-${PROCEDURE_TYPES_MAP.regular}-radio"]`,
  ).click();
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

export function privatePractitionerCreatesElectronicCaseForBusiness() {
  cy.get('[data-testid="file-a-petition"]').click();
  attachSamplePdfFile('stin-file');
  cy.get('[data-testid="complete-step-1"]').click();
  attachSamplePdfFile('petition-file');
  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="case-type-select"]').select('Notice of Deficiency');
  attachSamplePdfFile('atp-file-upload');

  cy.get('[data-testid="complete-step-2"]').click();

  cy.get('[data-testid="filing-type-2"]').click();
  cy.get('#is-business-type-0').click();
  cy.get('#businessType-Corporation').check();
  cy.get('[data-testid="contact-primary-name"]').type('Business Test Name');
  cy.get('[data-testid="contactPrimary.address1"]').type('Some Random Street');
  cy.get('[data-testid="contactPrimary.city"]').type('Boulder');
  cy.get('[data-testid="contactPrimary.state"]').select('CO');
  cy.get('[data-testid="contactPrimary.postalCode"]').type('32154');
  cy.get('[data-testid="phone"]').type('123456789');

  attachSamplePdfFile('corporate-disclosure-file');

  cy.get('[data-testid="complete-step-3"]').click();
  cy.get(
    `[data-testid="procedure-type-${PROCEDURE_TYPES_MAP.regular}-radio"]`,
  ).click();
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
  return cy
    .task('getFeatureFlagValue', { flag: 'updated-petition-flow' })
    .then(updatedFlow => {
      if (updatedFlow) {
        return petitionerAttemptsToUploadCorruptPdfUpdated();
      } else {
        return petitionerAttemptsToUploadCorruptPdfOld();
      }
    });
}

export function petitionerAttemptsToUploadCorruptPdfOld() {
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();
  attachFile({
    filePath: '../../helpers/file/corrupt-pdf.pdf',
    selector: '[data-testid="stin-file"]',
  });
  cy.get('[data-testid="file-upload-error-modal"]').contains(
    'The file is corrupted or in an unsupported PDF format. Ensure that the file is not corrupted and/or is in a supported PDF format and try again.',
  );
}
