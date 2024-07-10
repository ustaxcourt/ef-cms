import {
  contactInfo,
  fillCaseProcedureInformation,
  fillIrsNoticeInformation,
  fillPetitionFileInformation,
  fillPrimaryContact,
  fillPrimaryContactInternational,
  fillStinInformation,
} from './petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition - Step 6 Review & Submit Case', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
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

      cy.get('[data-testid="edit-petition-section-button-1"]').click();

      cy.get('[data-testid="step-indicator-current-step-1-icon"]').should(
        'be.visible',
      );
    });

    it('should display petitioner information correctly for international address', () => {
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
        'have.text',
        'Place of legal residence:',
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
