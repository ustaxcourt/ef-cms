import {
  contactInfo,
  fillCaseProcedureInformation,
  fillGeneratePetitionFileInformation,
  fillIrsNoticeInformation,
  fillPetitionFileInformation,
  fillPetitionerAndSpouseInformation,
  fillPrimaryContact,
  fillSecondaryContact,
  fillSecondaryContactInternational,
  fillStinInformation,
  secondaryContactInfo,
} from './petition-helper';
import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition - Step 6 Review & Submit Case', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  describe('Petitioner', () => {
    beforeEach(() => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');
    });
    describe('Filing type: Myself and Spouse', () => {
      beforeEach(() => {
        cy.get('[data-testid="filing-type-1"]').click();
        fillPrimaryContact();
      });

      it('should display petitioner information correctly for deceased spouse', () => {
        cy.get('[data-testid="is-spouse-deceased-0"]').click();
        cy.get('[data-testid="contact-secondary-name"]').type(
          secondaryContactInfo.name,
        );

        cy.get('[data-testid="contactSecondary-in-care-of"]').type(
          secondaryContactInfo.inCareOf,
        );

        fillSecondaryContact();
        cy.get('[data-testid="step-1-next-button"]').click();

        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);

        cy.get('[data-testid="party-type"]').should(
          'have.text',
          'Petitioner & deceased spouse',
        );

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

        cy.get('[data-testid=place-of-legal-residence-label]').should(
          'have.text',
          'Place of legal residence:',
        );

        cy.get('[data-testid="primary-place-of-legal-residence"]').should(
          'have.text',
          contactInfo.placeOfLegalResidenceLabel,
        );

        cy.get('[data-testid="contact-info-phone-number"]')
          .eq(0)
          .should('contain.text', contactInfo.phone);

        cy.get('[data-testid="contact-primary-email"]')
          .eq(0)
          .should('contain.text', contactInfo.email);

        cy.get('[data-testid="contact-name"]')
          .eq(1)
          .invoke('text')
          .then(value => value.trim())
          .should('equal', secondaryContactInfo.name);

        cy.get('[data-testid="contact-in-care-of-secondary-name"]').should(
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
          'contain.text',
          secondaryContactInfo.email,
        );

        cy.get('[data-testid="register-for-e-filing"]').should('exist');
      });

      it('should display petitioner information correctly when user does not select use same address', () => {
        cy.get('[data-testid="is-spouse-deceased-0"]').click();

        cy.get('[data-testid="contact-secondary-name"]').type(
          secondaryContactInfo.name,
        );

        cy.get('[data-testid="contactSecondary-in-care-of"]').type(
          secondaryContactInfo.inCareOf,
        );

        fillSecondaryContact(false);

        cy.get('[data-testid="step-1-next-button"]').click();

        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);

        cy.get('[data-testid="party-type"]').should(
          'have.text',
          'Petitioner & deceased spouse',
        );

        cy.get('[data-testid="contact-name"]')
          .eq(1)
          .invoke('text')
          .then(value => value.trim())
          .should('equal', secondaryContactInfo.name);

        cy.get('[data-testid="contact-in-care-of-secondary-name"]').should(
          'contain.text',
          secondaryContactInfo.inCareOf,
        );

        cy.get('[data-testid="contact-address-information"]')
          .eq(1)
          .should('contain.text', secondaryContactInfo.address1);

        cy.get('[data-testid="contact-address-information"]')
          .eq(1)
          .should('contain.text', secondaryContactInfo.city);

        cy.get('[data-testid="contact-address-information"]')
          .eq(1)
          .should('contain.text', secondaryContactInfo.state);

        cy.get('[data-testid="contact-address-information"]')
          .eq(1)
          .should('contain.text', secondaryContactInfo.postalCode);

        cy.get('[data-testid="secondary-place-of-legal-residence"]').should(
          'have.text',
          secondaryContactInfo.placeOfLegalResidenceLabel,
        );

        cy.get('[data-testid="contact-info-phone-number"]')
          .eq(1)
          .should('contain.text', secondaryContactInfo.phone);

        cy.get('[data-testid="contact-info-email"]').should(
          'contain.text',
          secondaryContactInfo.email,
        );
      });

      it('should display petitioner information correctly for spouse', () => {
        cy.get('[data-testid="is-spouse-deceased-1"]').click();
        cy.get('[data-testid="have-spouse-consent-label"]').click();

        cy.get('[data-testid="contact-secondary-name"]').type(
          secondaryContactInfo.name,
        );
        fillSecondaryContact();

        cy.get('[data-testid="step-1-next-button"]').click();

        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);

        cy.get('[data-testid="party-type"]').should(
          'have.text',
          'Petitioner & spouse',
        );

        cy.get('[data-testid="contact-name"]')
          .eq(1)
          .invoke('text')
          .then(value => value.trim())
          .should('equal', secondaryContactInfo.name);

        cy.get('[data-testid="contact-in-care-of-secondary-name"]').should(
          'not.exist',
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
          'contain.text',
          secondaryContactInfo.email,
        );
      });

      it('should display petitioner information correctly for spouse with an international address and not display legal place of residence if user does not select one', () => {
        cy.get('[data-testid="is-spouse-deceased-1"]').click();
        cy.get('[data-testid="have-spouse-consent-label"]').click();

        cy.get('[data-testid="contact-secondary-name"]').type(
          secondaryContactInfo.name,
        );

        fillSecondaryContactInternational();

        cy.get('[data-testid="contact-secondary-phone"]').type(
          secondaryContactInfo.phone,
        );
        cy.get('[data-testid="contact-secondary-email"]').type(
          secondaryContactInfo.email,
        );
        cy.get(
          '[data-testid="register-email-address-provided-above-for-electronic-filing-and-service-label"]',
        ).click();

        cy.get('[data-testid="step-1-next-button"]').click();

        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);

        cy.get('[data-testid="party-type"]').should(
          'have.text',
          'Petitioner & spouse',
        );

        cy.get('[data-testid="contact-name"]')
          .eq(1)
          .invoke('text')
          .then(value => value.trim())
          .should('equal', secondaryContactInfo.name);

        cy.get('[data-testid="contact-in-care-of-secondary-name"]').should(
          'not.exist',
        );

        cy.get('[data-testid="contact-address-information"]')
          .eq(1)
          .should('contain.text', secondaryContactInfo.address1);

        cy.get('[data-testid="contact-address-information"]')
          .eq(1)
          .should('contain.text', secondaryContactInfo.city);

        cy.get('[data-testid="contact-address-information"]')
          .eq(1)
          .should('contain.text', secondaryContactInfo.internationalState);

        cy.get('[data-testid="contact-address-information"]')
          .eq(1)
          .should('contain.text', secondaryContactInfo.internationalPostalCode);

        cy.get('[data-testid="contact-address-information"]')
          .eq(1)
          .should('contain.text', secondaryContactInfo.country);

        cy.get('[data-testid="secondary-place-of-legal-residence"]').should(
          'not.exist',
        );

        cy.get('[data-testid="contact-info-phone-number"]')
          .eq(1)
          .should('contain.text', secondaryContactInfo.phone);

        cy.get('[data-testid="contact-info-email"]').should(
          'contain.text',
          secondaryContactInfo.email,
        );
      });
    });
  });

  describe('Practitioner', () => {
    beforeEach(() => {
      loginAsPrivatePractitioner();
      cy.visit('/file-a-petition/new');
      fillPetitionerAndSpouseInformation();
      fillGeneratePetitionFileInformation();
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);
    });
    describe('Filing type: Myself and Spouse', () => {
      it('should not display email information for spouse', () => {
        cy.get('[data-testid="contact-info-email"]')
          .eq(0)
          .should('contain.text', 'privatePractitioner1@example.com');
        cy.get('[data-testid="service-email-label"]').should('not.exist');
        cy.get('[data-testid="contact-info-email"]')
          .eq(1)
          .should('contain.text', 'Email not provided');
        cy.get('[data-testid="register-for-e-filing"]').should('not.exist');
      });
    });
  });
});
