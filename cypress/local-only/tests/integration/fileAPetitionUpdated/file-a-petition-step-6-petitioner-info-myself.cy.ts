import {
  contactInfo,
  fillCaseProcedureInformation,
  fillGeneratePetitionFileInformation,
  fillIrsNoticeInformation,
  fillPetitionFileInformation,
  fillPetitionerInformation,
  fillPrimaryContact,
  fillPrimaryContactInternational,
  fillStinInformation,
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

    describe('Edit step 1', () => {
      it('should navigate to petition flow step 1 when user clicks on edit button', () => {
        fillPetitionerInformation();
        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);
        cy.get('[data-testid="edit-petition-section-button-1"]').click();
        cy.get('[data-testid="step-indicator-current-step-1-icon"]').should(
          'be.visible',
        );
      });
    });

    describe('Filing type: Myself', () => {
      it('should display petitioner information correctly', () => {
        cy.get('[data-testid="filing-type-0"]').click();
        fillPrimaryContact();
        cy.get('[data-testid="step-1-next-button"]').click();

        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);

        cy.get('[data-testid="party-type"]').should('have.text', 'Petitioner');

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

        cy.get('[data-testid=place-of-legal-residence-label]').should(
          'have.text',
          'Place of legal residence:',
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
      });

      it('should display petitioner information correctly for international address and should not show legal place of residence if user did not select one', () => {
        cy.get('[data-testid="filing-type-0"]').click();
        cy.get('[data-testid="contact-primary-name"]').type(contactInfo.name);
        fillPrimaryContactInternational();
        cy.get('[data-testid="step-1-next-button"]').click();

        cy.get('[data-testid="contact-primary-phone"]').type(contactInfo.phone);
        cy.get('[data-testid="step-1-next-button"]').click();

        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);

        cy.get('[data-testid="party-type"]').should('have.text', 'Petitioner');

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

        cy.get('[data-testid=place-of-legal-residence-label]').should(
          'not.exist',
        );

        cy.get('[data-testid="primary-place-of-legal-residence"]').should(
          'not.exist',
        );

        cy.get('[data-testid="contact-primary-email"]').should(
          'have.text',
          contactInfo.email,
        );
      });

      it('should not show counsel contact information when user generates petition file', () => {
        fillPetitionerInformation();
        fillGeneratePetitionFileInformation();
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);
        cy.get('[data-testid="petition-review-counsel-information"]').should(
          'not.exist',
        );
      });

      it('should not show counsel contact information when user uploads petitions file', () => {
        fillPetitionerInformation();
        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);
        cy.get('[data-testid="petition-review-counsel-information"]').should(
          'not.exist',
        );
      });
    });
  });

  describe('Practitioner', () => {
    beforeEach(() => {
      loginAsPrivatePractitioner();
      cy.visit('/file-a-petition/new');
    });
    it('should show counsel contact information when user generated the petition', () => {
      fillPetitionerInformation();
      fillGeneratePetitionFileInformation();
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);

      cy.get('[data-testid="petition-review-counsel-information"]').contains(
        'Counsel’s Contact Information',
      );

      cy.get('[data-testid="info-alert"]').contains(
        'The Petition will not be created with the Court until the Submit Documents & Create Case button is clicked.',
      );
    });

    it('should not show counsel contact information when user uploaded petition', () => {
      fillPetitionerInformation();
      fillPetitionFileInformation(VALID_FILE);
      fillIrsNoticeInformation(VALID_FILE);
      fillCaseProcedureInformation();
      fillStinInformation(VALID_FILE);
      cy.get('[data-testid="petition-review-counsel-information"]').should(
        'not.exist',
      );
    });
  });
});
