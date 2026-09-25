import {
  loginAsPetitioner,
  loginAsPetitionsClerk,
} from '../../../../helpers/authentication/login-as-helpers';
import { PROCEDURE_TYPES_MAP } from '@shared/business/entities/EntityConstants';
import { attachSamplePdfFile } from '../../../../helpers/file/upload-file';
import { getCypressEnv } from '../../../../helpers/env/cypressEnvironment';
import { goToCase } from '../../../../helpers/caseDetail/go-to-case';

describe('Payment Status Pending', () => {
  it('should display "Pending" after petitioner files and submits payment', () => {
    petitionerCreatesElectronicCase().then(docketNumber => {
      cy.get('[data-testid="pay-filing-fee-button"]').click();

      cy.origin(getCypressEnv().payGovOrigin, () => {
        cy.get(
          'a[data-payment-method="ACH"][data-payment-status="Failed"]',
        ).click();
      });

      cy.get('[data-testid="warning-alert-title"]').contains(
        'Filing fee payment is pending',
      );
      cy.get(`[href="/case-detail/${docketNumber}"]`).click();
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="case-filing-fee-information"]').contains('Pending');
      loginAsPetitionsClerk();
      goToCase(docketNumber);
      cy.get('[data-testid="document-viewer-link-P"]').click();
      cy.get('[data-testid="review-and-serve-petition"]').click();
      cy.get('[data-testid="tab-case-info"]').click();
      cy.get('[data-testid="payment-status-pending-radio"]').contains(
        'Pending',
      );
      cy.get('[data-testid="tab-irs-notice"]').click();
      cy.get('[data-testid="has-irs-verified-notice-no"]').click();
      cy.get('[data-testid="submit-case"]').click();
      cy.get('[data-testid="serve-case-to-irs"]').click();
      cy.get('[data-testid="modal-confirm"]').click();
      cy.get('[data-testid="tab-case-information"]').click();
      cy.get('[data-testid="edit-case-details-button"]').click();
      cy.get('[data-testid="payment-status-pending-radio"]').contains(
        'Pending',
      );
    });
  });
});

const petitionerCreatesElectronicCase = (): Cypress.Chainable<string> => {
  loginAsPetitioner();
  cy.get('[data-testid="file-a-petition"]').click();
  cy.get('[data-testid="go-to-step-1"]').click();

  cy.get('[data-testid="filing-type-0"]').click();
  cy.get('[data-testid="contact-primary-name"]').type('alex was here');
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
    .should('be.visible')
    .invoke('text')
    .then(docketNumberWithSuffix => {
      return cy.wrap<string>(docketNumberWithSuffix);
    });
};
