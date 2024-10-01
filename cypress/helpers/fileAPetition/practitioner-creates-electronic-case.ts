import { PROCEDURE_TYPES_MAP } from '../../../shared/src/business/entities/EntityConstants';
import { attachSamplePdfFile } from '../file/upload-file';
import { petitionerCreatesElectronicCaseUpdated } from './petitioner-creates-electronic-case-updated';

export function practitionerCreatesElectronicCase() {
  return cy
    .task('getFeatureFlagValue', { flag: 'updated-petition-flow' })
    .then(updatedFlow => {
      if (updatedFlow) {
        return petitionerCreatesElectronicCaseUpdated();
      }
      return practitionerCreatesElectronicCaseOld();
    });
}

export function practitionerCreatesElectronicCaseOld() {
  cy.get('[data-testid="file-a-petition"]').click();
  attachSamplePdfFile('stin-file');
  cy.get('[data-testid="complete-step-1"]').click();
  attachSamplePdfFile('petition-file');
  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="case-type-select"]').select('Notice of Deficiency');
  cy.get('[data-testid="complete-step-2"]').click();
  cy.get('[data-testid="filing-type-1"]').click();
  cy.get('[data-testid="is-spouse-deceased-1"]').click();
  cy.get('[data-testid="modal-confirm"]').click();
  cy.get('[data-testid="contact-primary-name"]').type('John');
  cy.get('[data-testid="contact-secondary-name"]').type('Sally');
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
