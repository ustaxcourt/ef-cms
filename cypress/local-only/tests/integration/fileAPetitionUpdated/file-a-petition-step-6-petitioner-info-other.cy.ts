import {
  businessAndOtherContactInfo,
  contactInfo,
  fillBusinessandOtherContact,
  fillCaseProcedureInformation,
  fillIrsNoticeInformation,
  fillPetitionFileInformation,
  fillPrimaryContact,
  fillStinInformation,
} from './petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition - Step 6 Review & Submit Case', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
  });

  describe('Filing type: Other', () => {
    describe('An estate or trust', () => {
      it('should display petitioner information correctly for party type "Estate with an executor/personal representative/fiduciary/etc."', () => {
        cy.get('[data-testid="filing-type-3"]').click();
        cy.get('[data-testid="other-type-radio-option-0"]').click();
        cy.get('[data-testid="estate-type-radio-option-0"]').click();
        fillBusinessandOtherContact({
          fillSecondaryName: true,
          fillTitle: true,
        });
        cy.get('[data-testid="contactPrimary-placeOfLegalResidence"]').select(
          'AK',
        );
        cy.get('[data-testid="contact-primary-phone"]').type('3232323232');
        cy.get('[data-testid="step-1-next-button"]').click();

        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);

        cy.get('[data-testid="party-type"]').should(
          'have.text',
          'Estate with an executor/personal representative/fiduciary/etc.',
        );

        cy.get('[data-testid="contact-name"]')
          .invoke('text')
          .then(value => value.trim())
          .should('equal', businessAndOtherContactInfo.name);

        cy.get('[data-testid="contact-in-care-of-secondary-name"]').should(
          'have.text',
          `c/o ${businessAndOtherContactInfo.secondaryName}, ${businessAndOtherContactInfo.title}`,
        );
        cy.get('[data-testid="place-of-legal-residence-label"]').should(
          'have.text',
          'Place of legal residence:',
        );
        cy.get('[data-testid="primary-place-of-legal-residence"]').should(
          'have.text',
          'Alaska',
        );
      });

      it('should display petitioner information correctly for party type "Estate without an executor/personal representative/fiduciary/etc."', () => {
        cy.get('[data-testid="filing-type-3"]').click();
        cy.get('[data-testid="other-type-radio-option-0"]').click();
        cy.get('[data-testid="estate-type-radio-option-1"]').click();
        fillBusinessandOtherContact({
          fillInCareOf: true,
        });
        cy.get('[data-testid="contactPrimary-placeOfLegalResidence"]').select(
          'AK',
        );
        cy.get('[data-testid="contact-primary-phone"]').type('3232323232');
        cy.get('[data-testid="step-1-next-button"]').click();

        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);

        cy.get('[data-testid="party-type"]').should(
          'have.text',
          'Estate without an executor/personal representative/fiduciary/etc.',
        );

        cy.get('[data-testid="contact-name"]')
          .invoke('text')
          .then(value => value.trim())
          .should('equal', businessAndOtherContactInfo.name);

        cy.get('[data-testid="contact-in-care-of-secondary-name"]').should(
          'have.text',
          `c/o ${businessAndOtherContactInfo.inCareOf}`,
        );
        cy.get('[data-testid="place-of-legal-residence-label"]').should(
          'have.text',
          'Place of legal residence:',
        );
        cy.get('[data-testid="primary-place-of-legal-residence"]').should(
          'have.text',
          'Alaska',
        );
      });

      it('should display petitioner information correctly for party type "Trust"', () => {
        cy.get('[data-testid="filing-type-3"]').click();
        cy.get('[data-testid="other-type-radio-option-0"]').click();
        cy.get('[data-testid="estate-type-radio-option-2"]').click();
        fillBusinessandOtherContact({
          fillSecondaryName: true,
        });
        cy.get('[data-testid="contactPrimary-placeOfLegalResidence"]').select(
          'AK',
        );
        cy.get('[data-testid="contact-primary-phone"]').type('3232323232');
        cy.get('[data-testid="step-1-next-button"]').click();

        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);

        cy.get('[data-testid="party-type"]').should('have.text', 'Trust');

        cy.get('[data-testid="contact-name"]')
          .invoke('text')
          .then(value => value.trim())
          .should('equal', businessAndOtherContactInfo.name);

        cy.get('[data-testid="contact-in-care-of-secondary-name"]').should(
          'have.text',
          `c/o ${businessAndOtherContactInfo.secondaryName}`,
        );
        cy.get('[data-testid="place-of-legal-residence-label"]').should(
          'have.text',
          'Place of legal residence:',
        );
        cy.get('[data-testid="primary-place-of-legal-residence"]').should(
          'have.text',
          'Alaska',
        );
      });
    });

    describe('A minor or legally incompetent person', () => {
      const radioOptions = [
        { option: 0, partyType: 'Conservator' },
        { option: 1, partyType: 'Guardian' },
        { option: 2, partyType: 'Custodian' },
        {
          option: 3,
          partyType:
            'Next friend for a minor (without a guardian, conservator, or other like fiduciary)',
        },
        {
          option: 4,
          partyType:
            'Next friend for a legally incompetent person (without a guardian, conservator, or other like fiduciary)',
        },
      ];

      radioOptions.forEach(({ option, partyType }) => {
        describe(`${partyType}`, () => {
          beforeEach(() => {
            cy.get('[data-testid="filing-type-3"]').click();
            cy.get('[data-testid="other-type-radio-option-1"]').click();
            cy.get(
              `[data-testid="minor-incompetent-type-radio-option-${option}"]`,
            ).click();
            fillBusinessandOtherContact({
              fillSecondaryName: true,
            });
            cy.get(
              '[data-testid="contactPrimary-placeOfLegalResidence"]',
            ).select(contactInfo.placeOfLegalResidence);
            cy.get('[data-testid="contact-primary-phone"]').type(
              contactInfo.phone,
            );
            cy.get('[data-testid="step-1-next-button"]').click();
            fillPetitionFileInformation(VALID_FILE);
            fillIrsNoticeInformation(VALID_FILE);
            fillCaseProcedureInformation();
            fillStinInformation(VALID_FILE);
          });

          it(`should display petitioner information correctly for party type "${partyType}"`, () => {
            cy.get('[data-testid="party-type"]').should('have.text', partyType);

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
              'Place of legal residence:',
            );
            cy.get('[data-testid="primary-place-of-legal-residence"]').should(
              'have.text',
              contactInfo.placeOfLegalResidenceLabel,
            );
          });
        });
      });
    });

    describe('Donor', () => {
      it('should display petitioner information correctly for party type "Donor"', () => {
        cy.get('[data-testid="filing-type-3"]').click();
        cy.get('[data-testid="other-type-radio-option-2"]').click();
        fillPrimaryContact();
        cy.get('[data-testid="step-1-next-button"]').click();

        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);

        cy.get('[data-testid="party-type"]').should('have.text', 'Donor');

        cy.get('[data-testid="contact-name"]')
          .invoke('text')
          .then(value => value.trim())
          .should('equal', contactInfo.name);

        cy.get('[data-testid=place-of-legal-residence-label]').should(
          'have.text',
          'Place of legal residence:',
        );
      });
    });

    describe('Transferee', () => {
      it('should display petitioner information correctly for party type "Transferee"', () => {
        cy.get('[data-testid="filing-type-3"]').click();
        cy.get('[data-testid="other-type-radio-option-3"]').click();
        fillPrimaryContact();
        cy.get('[data-testid="step-1-next-button"]').click();

        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);

        cy.get('[data-testid="party-type"]').should('have.text', 'Transferee');

        cy.get('[data-testid="contact-name"]')
          .invoke('text')
          .then(value => value.trim())
          .should('equal', contactInfo.name);

        cy.get('[data-testid=place-of-legal-residence-label]').should(
          'have.text',
          'Place of legal residence:',
        );
      });
    });

    describe('Deceased Spouse', () => {
      it('should display petitioner information correctly for party type "Deceased Spouse"', () => {
        cy.get('[data-testid="filing-type-3"]').click();
        cy.get('[data-testid="other-type-radio-option-4"]').click();
        fillBusinessandOtherContact({ fillSecondaryName: true });
        cy.get('[data-testid="contactPrimary-placeOfLegalResidence"]').select(
          contactInfo.placeOfLegalResidence,
        );
        cy.get('[data-testid="contact-primary-phone"]').type(contactInfo.phone);
        cy.get('[data-testid="step-1-next-button"]').click();

        fillPetitionFileInformation(VALID_FILE);
        fillIrsNoticeInformation(VALID_FILE);
        fillCaseProcedureInformation();
        fillStinInformation(VALID_FILE);

        cy.get('[data-testid="party-type"]').should(
          'have.text',
          'Surviving spouse',
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
          'Place of legal residence:',
        );
      });
    });
  });
});
