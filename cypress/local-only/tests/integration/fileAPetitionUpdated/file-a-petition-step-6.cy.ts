import {
  fillCaseProcedureInformation,
  fillIrsNoticeInformation,
  fillPetitionFileInformation,
  fillStinInformation,
} from './petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

const contactInfo = {
  address1: '111 South West St.',
  city: 'Orlando',
  country: 'Country Name',
  email: 'petitioner1@example.com',
  internationalPostalCode: '12345-AB',
  internationalState: 'Province',
  name: 'John',
  phone: '3232323232',
  placeOfLegalResidence: 'DE',
  placeOfLegalResidenceLabel: 'Delaware',
  postalCode: '33233',
  state: 'AK',
};

const secondaryContactInfo = {
  address1: '222 North East blv.',
  city: 'Boulder',
  country: 'Another Country Name',
  email: 'petitioner2@example.com',
  inCareOf: 'Spouse Care of',
  internationalPostalCode: '54321-CD',
  internationalState: 'Province',
  name: 'Bill',
  phone: '7878787878',
  placeOfLegalResidence: 'NJ',
  placeOfLegalResidenceLabel: 'New Jersey',
  postalCode: '88788',
  state: 'CO',
};

describe('File a petition - Step 6 Review & Submit Case', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
  });

  describe('Filing type: Myself', () => {
    describe('Domestic', () => {
      it('should display petitioner information', () => {
        cy.get('[data-testid="filing-type-0"]').click();
        cy.get('[data-testid="contact-primary-name"]').type(contactInfo.name);
        cy.get('[data-testid="contactPrimary.address1"]').type(
          contactInfo.address1,
        );
        cy.get('[data-testid="contactPrimary.city"]').type(contactInfo.city);
        cy.get('[data-testid="contactPrimary.state"]').select(
          contactInfo.state,
        );
        cy.get('[data-testid="contactPrimary.postalCode"]').type(
          contactInfo.postalCode,
        );
        cy.get('[data-testid="contactPrimary.placeOfLegalResidence"]').select(
          contactInfo.placeOfLegalResidence,
        );
        cy.get('[data-testid="contact-primary-phone"]').type(contactInfo.phone);
        cy.get('[data-testid="step-1-next-button"]').click();

        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);

        cy.get('[data-testid="contact-name"]')
          .invoke('text')
          .then(value => value.trim())
          .should('equal', contactInfo.name);

        cy.get('[data-testid="contact-address-information"]').should(
          'contain.text',
          contactInfo.address1,
        );

        cy.get('[data-testid="contact-address-information"]').should(
          'contain.text',
          contactInfo.city,
        );

        cy.get('[data-testid="contact-address-information"]').should(
          'contain.text',
          contactInfo.state,
        );

        cy.get('[data-testid="contact-address-information"]').should(
          'contain.text',
          contactInfo.postalCode,
        );

        cy.get('[data-testid="primary-place-of-legal-residence"]').should(
          'have.text',
          contactInfo.placeOfLegalResidenceLabel,
        );

        cy.get('[data-testid="contact-info-phone-number"]').should(
          'contain.text',
          contactInfo.phone,
        );

        cy.get('[data-testid="contact-primary-email"]').should(
          'have.text',
          contactInfo.email,
        );

        cy.get('[data-testid="edit-petition-section-button-1"]').click();

        cy.get('[data-testid="step-indicator-current-step-1-icon"]').should(
          'be.visible',
        );
      });
    });

    describe('International', () => {
      it('should display petitioner information when user chooses international address', () => {
        cy.get('[data-testid="filing-type-0"]').click();
        cy.get('[data-testid="contact-primary-name"]').type(contactInfo.name);
        cy.get('[data-testid="international-country-btn"]').click();
        cy.get('[data-testid="international-country-input"]').type(
          contactInfo.country,
        );
        cy.get('[data-testid="contactPrimary.address1"]').type(
          contactInfo.address1,
        );
        cy.get('[data-testid="contactPrimary.state"]').type(
          contactInfo.internationalState,
        );
        cy.get('[data-testid="contactPrimary.city"]').type(contactInfo.city);
        cy.get('[data-testid="contactPrimary.postalCode"]').type(
          contactInfo.internationalPostalCode,
        );
        cy.get('[data-testid="step-1-next-button"]').click();

        cy.get('[data-testid="contact-primary-phone"]').type(contactInfo.phone);
        cy.get('[data-testid="step-1-next-button"]').click();

        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);

        cy.get('[data-testid="contact-name"]')
          .invoke('text')
          .then(value => value.trim())
          .should('equal', contactInfo.name);

        cy.get('[data-testid="address1-line"]').should(
          'have.text',
          contactInfo.address1,
        );

        cy.get('[data-testid="contact-address-information"]').should(
          'contain.text',
          contactInfo.city,
        );

        cy.get('[data-testid="contact-address-information"]').should(
          'contain.text',
          contactInfo.internationalState,
        );

        cy.get('[data-testid="contact-address-information"]').should(
          'contain.text',
          contactInfo.internationalPostalCode,
        );

        cy.get('[data-testid="contact-country-line"]').should(
          'have.text',
          contactInfo.country,
        );

        cy.get('[data-testid="primary-place-of-legal-residence"]').should(
          'have.text',
          'N/A',
        );

        cy.get('[data-testid="contact-primary-email"]').should(
          'have.text',
          contactInfo.email,
        );
      });
    });
  });

  describe('Myself and Spouse', () => {
    it('should display petitioner information', () => {
      cy.get('[data-testid="filing-type-1"]').click();
      cy.get('[data-testid="contact-primary-name"]').type(contactInfo.name);
      cy.get('[data-testid="contactPrimary.address1"]').type(
        contactInfo.address1,
      );
      cy.get('[data-testid="contactPrimary.city"]').type(contactInfo.city);
      cy.get('[data-testid="contactPrimary.state"]').select(contactInfo.state);
      cy.get('[data-testid="contactPrimary.postalCode"]').type(
        contactInfo.postalCode,
      );
      cy.get('[data-testid="contactPrimary.placeOfLegalResidence"]').select(
        contactInfo.placeOfLegalResidence,
      );
      cy.get('[data-testid="contact-primary-phone"]').type(contactInfo.phone);
      cy.get('[data-testid="is-spouse-deceased-0"]').click();

      cy.get('[data-testid="contact-secondary-name"]').type(
        secondaryContactInfo.name,
      );

      cy.get('[data-testid="contactSecondary-in-care-of"]').type(
        secondaryContactInfo.inCareOf,
      );

      cy.get('[data-testid="contactSecondary.placeOfLegalResidence"]').select(
        secondaryContactInfo.placeOfLegalResidence,
      );

      cy.get('[data-testid="contact-secondary-email"]').type(
        secondaryContactInfo.email,
      );

      cy.get(
        '[data-testid="register-email-address-provided-above-for-electronic-filing-and-service-label"]',
      ).click();

      cy.get('[data-testid="contact-secondary-phone"]').type(
        secondaryContactInfo.phone,
      );
      cy.get('[data-testid="step-1-next-button"]').click();

      fillPetitionFileInformation(VALID_FILE);
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.get('[data-testid="contact-name"]')
        .eq(0)
        .invoke('text')
        .then(value => value.trim())
        .should('equal', contactInfo.name);

      cy.get('[data-testid="contact-address-information"]')
        .eq(0)
        .should('contain.text', contactInfo.address1);

      cy.get('[data-testid="contact-address-information"]')
        .eq(0)
        .should('contain.text', contactInfo.city);

      cy.get('[data-testid="contact-address-information"]')
        .eq(0)
        .should('contain.text', contactInfo.state);

      cy.get('[data-testid="contact-address-information"]')
        .eq(0)
        .should('contain.text', contactInfo.postalCode);

      cy.get('[data-testid="primary-place-of-legal-residence"]').should(
        'have.text',
        contactInfo.placeOfLegalResidenceLabel,
      );

      cy.get('[data-testid="contact-info-phone-number"]')
        .eq(0)
        .should('contain.text', contactInfo.phone);

      cy.get('[data-testid="contact-primary-email"]')
        .eq(0)
        .should('have.text', contactInfo.email);

      cy.get('[data-testid="contact-name"]')
        .eq(1)
        .invoke('text')
        .then(value => value.trim())
        .should('equal', secondaryContactInfo.name);

      cy.get('[data-testid="contact-in-care-of"]').should(
        'contain.text',
        secondaryContactInfo.inCareOf,
      );

      cy.get('[data-testid="contact-address-information"]')
        .eq(1)
        .should('contain.text', contactInfo.address1);

      cy.get('[data-testid="contact-address-information"]')
        .eq(1)
        .should('contain.text', contactInfo.city);

      cy.get('[data-testid="contact-address-information"]')
        .eq(1)
        .should('contain.text', contactInfo.state);

      cy.get('[data-testid="contact-address-information"]')
        .eq(1)
        .should('contain.text', contactInfo.postalCode);

      cy.get('[data-testid="secondary-place-of-legal-residence"]').should(
        'have.text',
        secondaryContactInfo.placeOfLegalResidenceLabel,
      );

      cy.get('[data-testid="contact-info-phone-number"]')
        .eq(1)
        .should('contain.text', secondaryContactInfo.phone);

      cy.get('[data-testid="contact-info-email"]').should(
        'have.text',
        secondaryContactInfo.email,
      );
    });
  });
});
