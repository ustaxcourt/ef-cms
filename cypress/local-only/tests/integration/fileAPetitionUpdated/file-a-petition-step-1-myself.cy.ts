import { InputFillType, selectInput, textInput } from './petition-helper';
import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition: Step 1 - Petitioner Information', () => {
  describe('Petitioner', () => {
    beforeEach(() => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');
      cy.get('[data-testid="step-indicator-current-step-1-icon"]');
    });

    it('should display all the possible options', () => {
      const EXPECTED_FILING_TYPES: string[] = [
        'Myself',
        'Myself and my spouse',
        'A business',
        'Other',
      ];
      cy.get('.filing-type-radio-option').should('have.length', 4);
      cy.get('.filing-type-radio-option').each((element, index) => {
        cy.wrap(element).should('have.text', EXPECTED_FILING_TYPES[index]);
      });
    });

    it('should display a validation error message if user does not select filing type', () => {
      cy.get('[data-testid="filling-type-error-message"]').should('not.exist');

      cy.get('[data-testid="step-1-next-button"]').click();

      cy.get('[data-testid="filling-type-error-message"]').should('exist');
    });

    describe('Myself', () => {
      beforeEach(() => {
        cy.get('[data-testid="filing-type-0"').click();
      });

      it('should display an input for "place of legal residence"', () => {
        cy.get('[data-testid="contactPrimary-placeOfLegalResidence"]').should(
          'exist',
        );
      });

      it('should display correct label for contact name', () => {
        cy.get('[data-testid="filing-type-0"]').click();
        cy.get('[data-testid="contact-primary-name-label"]').should(
          'have.text',
          'Full Name',
        );
      });

      it('should not display email field', () => {
        cy.get('[data-testid="filing-type-0"]').click();
        cy.get('[data-testid="contact-primary-paper-petition-email"]').should(
          'not.exist',
        );
      });
      it('should display validation error messages to all required fields left empty', () => {
        const ERROR_MESSAGES_DATA_TEST_ID = [
          'primary-contact-name-error-message',
          'address-1-error-message',
          'city-error-message',
          'state-error-message',
          'postal-code-error-message',
          'phone-error-message',
        ];

        ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
          cy.get(`[data-testid="${selector}"]`).should('not.exist');
        });

        cy.get('[data-testid="step-1-next-button"]').click();
        cy.get('[data-testid*="-error-message"]').should(
          'have.length',
          ERROR_MESSAGES_DATA_TEST_ID.length,
        );

        ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
          cy.get(`[data-testid="${selector}"]`).should('exist');
        });
      });

      it('should do live validation when user leaves input with an invalid response and remove message when user fixes it', () => {
        const ERROR_MESSAGES_DATA_TEST_ID: InputFillType[] = [
          {
            errorMessage: 'primary-contact-name-error-message',
            input: 'contact-primary-name',
            inputValue: 'John Cruz',
          },
          {
            errorMessage: 'address-1-error-message',
            input: 'contactPrimary.address1',
            inputValue: '123 Test Drive',
          },
          {
            errorMessage: 'city-error-message',
            input: 'contactPrimary.city',
            inputValue: 'Boulder',
          },
          {
            errorMessage: 'state-error-message',
            input: 'contactPrimary.state',
            selectOption: 'CO',
          },
          {
            errorMessage: 'postal-code-error-message',
            input: 'contactPrimary.postalCode',
            inputValue: '12345',
          },
          {
            errorMessage: 'phone-error-message',
            input: 'contact-primary-phone',
            inputValue: 'Test Phone',
          },
        ];

        ERROR_MESSAGES_DATA_TEST_ID.forEach(inputInfo => {
          if ('selectOption' in inputInfo) {
            const { errorMessage, input, selectOption } = inputInfo;
            selectInput(errorMessage, input, selectOption);
          } else if ('inputValue' in inputInfo) {
            const { errorMessage, input, inputValue } = inputInfo;
            textInput(errorMessage, input, inputValue);
          }
        });
      });

      it('should allow user to go to step 3 if everything is filled out correctly', () => {
        const ERROR_MESSAGES_DATA_TEST_ID: InputFillType[] = [
          {
            errorMessage: 'primary-contact-name-error-message',
            input: 'contact-primary-name',
            inputValue: 'John Cruz',
          },
          {
            errorMessage: 'address-1-error-message',
            input: 'contactPrimary.address1',
            inputValue: '123 Test Drive',
          },
          {
            errorMessage: 'city-error-message',
            input: 'contactPrimary.city',
            inputValue: 'Boulder',
          },
          {
            errorMessage: 'state-error-message',
            input: 'contactPrimary.state',
            selectOption: 'CO',
          },
          {
            errorMessage: 'postal-code-error-message',
            input: 'contactPrimary.postalCode',
            inputValue: '12345',
          },
          {
            errorMessage: 'phone-error-message',
            input: 'contact-primary-phone',
            inputValue: 'Test Phone',
          },
        ];

        ERROR_MESSAGES_DATA_TEST_ID.forEach(inputInfo => {
          if ('selectOption' in inputInfo) {
            const { input, selectOption } = inputInfo;
            cy.get(`[data-testid="${input}"]`).scrollIntoView();
            cy.get(`select[data-testid="${input}"]`).select(selectOption);
          } else if ('inputValue' in inputInfo) {
            const { input, inputValue } = inputInfo;
            cy.get(`[data-testid="${input}"]`).scrollIntoView();
            cy.get(`[data-testid="${input}"]`).type(inputValue);
          }
        });

        cy.get('[data-testid="step-1-next-button"]').click();
        cy.get('[data-testid="step-indicator-current-step-2-icon"]');
      });
    });
  });

  describe('Practitioner', () => {
    beforeEach(() => {
      loginAsPrivatePractitioner();
      cy.visit('/file-a-petition/new');
    });

    describe('Myself', () => {
      it('should display correct filing type options for private practitioner', () => {
        const EXPECTED_FILING_TYPES: string[] = [
          'Petitioner',
          'Petitioner and petitioner spouse',
          'A business',
          'Other',
        ];
        cy.get('.filing-type-radio-option').should('have.length', 4);
        cy.get('.filing-type-radio-option').each((element, index) => {
          cy.wrap(element).should('have.text', EXPECTED_FILING_TYPES[index]);
        });
      });

      it('should display correct label for contact name', () => {
        cy.get('[data-testid="filing-type-0"]').click();
        cy.get('[data-testid="contact-primary-name-label"]').should(
          'have.text',
          'Petitioner’s full name',
        );
      });
      it('should display email field', () => {
        cy.get('[data-testid="filing-type-0"]').click();
        cy.get('[data-testid="contact-primary-paper-petition-email"]').should(
          'exist',
        );
      });
    });
  });
});
