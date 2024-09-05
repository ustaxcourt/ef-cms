import { attachFile } from '../../../../helpers/file/upload-file';
import {
  businessAndOtherContactInfo,
  contactInfo,
  fillBusinessandOtherContact,
  fillCaseProcedureInformation,
  fillIrsNoticeInformation,
  fillPetitionFileInformation,
  fillStinInformation,
} from './petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition - Step 6 Review & Submit Case', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
  });

  describe('Filing type: Business', () => {
    it('Corporation: should display petitioner information correctly', () => {
      cy.get('[data-testid="filing-type-2"]').click();
      cy.get('[data-testid="business-type-0"]').click();
      fillBusinessandOtherContact({
        fillInCareOf: true,
      });
      cy.get('[data-testid="contactPrimary-placeOfLegalResidence"]').select(
        contactInfo.placeOfLegalResidence,
      );
      cy.get('[data-testid="contact-primary-phone"]').type(contactInfo.phone);
      attachFile({
        filePath: VALID_FILE,
        selector: '[data-testid="corporate-disclosure-file"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });

      cy.get('[data-testid="step-1-next-button"]').click();
      fillPetitionFileInformation(VALID_FILE);
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.get('[data-testid="party-type"]').should('have.text', 'Corporation');

      cy.get('[data-testid="corporate-disclosure-file-title"]').should(
        'have.text',
        'Corporate Disclosure Statement',
      );
      cy.get('[data-testid="cds-preview-button"]').should(
        'have.text',
        'sample.pdf',
      );
      cy.get('[data-testid="contact-name"]')
        .invoke('text')
        .then(value => value.trim())
        .should('equal', businessAndOtherContactInfo.name);
      cy.get('[data-testid="contact-in-care-of-secondary-name"]').should(
        'contain.text',
        businessAndOtherContactInfo.inCareOf,
      );
    });

    it('Partnership (as the Tax Matters Partner): should display petitioner information correctly', () => {
      cy.get('[data-testid="filing-type-2"]').click();
      cy.get('[data-testid="business-type-1"]').click();
      fillBusinessandOtherContact({
        fillSecondaryName: true,
      });
      cy.get('[data-testid="contactPrimary-placeOfLegalResidence"]').select(
        contactInfo.placeOfLegalResidence,
      );
      cy.get('[data-testid="contact-primary-phone"]').type(contactInfo.phone);
      attachFile({
        filePath: VALID_FILE,
        selector: '[data-testid="corporate-disclosure-file"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });

      cy.get('[data-testid="step-1-next-button"]').click();
      fillPetitionFileInformation(VALID_FILE);
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.get('[data-testid="party-type"]').should(
        'have.text',
        'Partnership (as the Tax Matters Partner)',
      );

      cy.get('[data-testid="corporate-disclosure-file-title"]').should(
        'have.text',
        'Corporate Disclosure Statement',
      );
      cy.get('[data-testid="cds-preview-button"]').should(
        'have.text',
        'sample.pdf',
      );

      cy.get('[data-testid="contact-name"]')
        .invoke('text')
        .then(value => value.trim())
        .should('equal', businessAndOtherContactInfo.name);

      cy.get('[data-testid="contact-in-care-of-secondary-name"]').should(
        'contain.text',
        businessAndOtherContactInfo.secondaryName,
      );

      cy.get('[data-testid=place-of-legal-residence-label]').should(
        'have.text',
        'Place of business:',
      );
      cy.get('[data-testid="primary-place-of-legal-residence"]').should(
        'have.text',
        contactInfo.placeOfLegalResidenceLabel,
      );
    });

    it('Partnership (as a partner other than Tax Matters Partner): should display petitioner information correctly', () => {
      cy.get('[data-testid="filing-type-2"]').click();
      cy.get('[data-testid="business-type-2"]').click();
      fillBusinessandOtherContact({
        fillSecondaryName: true,
      });
      cy.get('[data-testid="contactPrimary-placeOfLegalResidence"]').select(
        contactInfo.placeOfLegalResidence,
      );
      cy.get('[data-testid="contact-primary-phone"]').type(contactInfo.phone);
      attachFile({
        filePath: VALID_FILE,
        selector: '[data-testid="corporate-disclosure-file"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });

      cy.get('[data-testid="step-1-next-button"]').click();
      fillPetitionFileInformation(VALID_FILE);
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.get('[data-testid="party-type"]').should(
        'have.text',
        'Partnership (as a partner other than Tax Matters Partner)',
      );

      cy.get('[data-testid="corporate-disclosure-file-title"]').should(
        'have.text',
        'Corporate Disclosure Statement',
      );
      cy.get('[data-testid="cds-preview-button"]').should(
        'have.text',
        'sample.pdf',
      );

      cy.get('[data-testid="contact-name"]')
        .invoke('text')
        .then(value => value.trim())
        .should('equal', businessAndOtherContactInfo.name);

      cy.get('[data-testid="contact-in-care-of-secondary-name"]').should(
        'contain.text',
        businessAndOtherContactInfo.secondaryName,
      );

      cy.get('[data-testid=place-of-legal-residence-label]').should(
        'have.text',
        'Place of business:',
      );
      cy.get('[data-testid="primary-place-of-legal-residence"]').should(
        'have.text',
        contactInfo.placeOfLegalResidenceLabel,
      );
    });

    it('Partnership (as a partnership representative under BBA): should display petitioner information correctly', () => {
      cy.get('[data-testid="filing-type-2"]').click();
      cy.get('[data-testid="business-type-3"]').click();
      fillBusinessandOtherContact({
        fillSecondaryName: true,
      });
      cy.get('[data-testid="contactPrimary-placeOfLegalResidence"]').select(
        contactInfo.placeOfLegalResidence,
      );
      cy.get('[data-testid="contact-primary-phone"]').type(contactInfo.phone);
      attachFile({
        filePath: VALID_FILE,
        selector: '[data-testid="corporate-disclosure-file"]',
        selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
      });

      cy.get('[data-testid="step-1-next-button"]').click();
      fillPetitionFileInformation(VALID_FILE);
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.get('[data-testid="party-type"]').should(
        'have.text',
        'Partnership (as a partnership representative under BBA)',
      );

      cy.get('[data-testid="corporate-disclosure-file-title"]').should(
        'have.text',
        'Corporate Disclosure Statement',
      );
      cy.get('[data-testid="cds-preview-button"]').should(
        'have.text',
        'sample.pdf',
      );

      cy.get('[data-testid="contact-name"]')
        .invoke('text')
        .then(value => value.trim())
        .should('equal', businessAndOtherContactInfo.name);

      cy.get('[data-testid="contact-in-care-of-secondary-name"]').should(
        'contain.text',
        businessAndOtherContactInfo.secondaryName,
      );

      cy.get('[data-testid=place-of-legal-residence-label]').should(
        'have.text',
        'Place of business:',
      );
      cy.get('[data-testid="primary-place-of-legal-residence"]').should(
        'have.text',
        contactInfo.placeOfLegalResidenceLabel,
      );
    });
  });
});
