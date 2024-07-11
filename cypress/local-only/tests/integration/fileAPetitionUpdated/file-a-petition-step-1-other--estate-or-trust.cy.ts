import { InputFillType, selectInput, textInput } from './petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition: Step 1 - Petitioner Information', () => {
  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
    cy.get('[data-testid="step-indicator-current-step-1-icon"]');
  });

  describe('Other', () => {
    beforeEach(() => {
      cy.get('[data-testid="filing-type-3"').click();
    });

    it('should display all other options', () => {
      const EXPECTED_FILING_TYPES: string[] = [
        'An estate or trust',
        'A minor or legally incompetent person',
        'Donor',
        'Transferee',
        'Deceased Spouse',
      ];
      cy.get('[data-testid="other-radio-option"]').should('have.length', 5);
      cy.get('[data-testid="other-radio-option"]').each((element, index) => {
        cy.wrap(element).should('have.text', EXPECTED_FILING_TYPES[index]);
      });
    });

    it('should display a validation error message when no other type is selected', () => {
      cy.get('[data-testid="other-type-error-message"]').should('not.exist');

      cy.get('[data-testid="step-1-next-button"]').click();

      cy.get('[data-testid="other-type-error-message"]').should('exist');
    });

    describe('An estate or trust', () => {
      beforeEach(() => {
        cy.get('[data-testid="other-radio-option"]').eq(0).click();
      });

      it('should display all estate type options', () => {
        const EXPECTED_FILING_TYPES: string[] = [
          'Estate with an executor/personal representative/fiduciary/etc.',
          'Estate without an executor/personal representative/fiduciary/etc.',
          'Trust',
        ];
        cy.get('[data-testid="estate-type-radio-option"]').should(
          'have.length',
          3,
        );
        cy.get('[data-testid="estate-type-radio-option"]').each(
          (element, index) => {
            cy.wrap(element).should('have.text', EXPECTED_FILING_TYPES[index]);
          },
        );
      });

      it('should display a validation error message when no estate type is selected', () => {
        cy.get('[data-testid="estate-type-error-message"]').should('not.exist');

        cy.get('[data-testid="step-1-next-button"]').click();

        cy.get('[data-testid="estate-type-error-message"]').should('exist');
      });

      describe('Estate with an executor/personal representative/fiduciary/etc.', () => {
        beforeEach(() => {
          cy.get('[data-testid="estate-type-radio-option"]').eq(0).click();
        });

        describe('Domestic', () => {
          beforeEach(() => {
            cy.get('[data-testid="domestic-country-btn"]').click();
          });
          const FORM_INPUT_DATA: InputFillType[] = [
            {
              errorMessage: 'primary-contact-name-error-message',
              input: 'contact-primary-name',
              inputValue: 'John Cruz',
            },
            {
              errorMessage: 'primary-secondary-contact-name-error-message',
              input: 'contact-primary-secondary-name',
              inputValue: 'John Cruz II',
            },
            {
              errorMessage: 'primary-contact-title-error-message',
              input: 'contact-primary-title',
              inputValue: 'John Cruz Title',
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

          const ERROR_MESSAGES_DATA_TEST_ID = [
            'primary-contact-name-error-message',
            'primary-secondary-contact-name-error-message',
            'primary-contact-title-error-message',
            'address-1-error-message',
            'city-error-message',
            'state-error-message',
            'postal-code-error-message',
            'phone-error-message',
          ];

          it('should display a validation error message when form is empty', () => {
            ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
              cy.get(`[data-testid="${selector}"]`).should('not.exist');
            });

            cy.get('[data-testid="step-1-next-button"]').click();

            ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
              cy.get(`[data-testid="${selector}"]`).should('exist');
            });
          });
          it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
            FORM_INPUT_DATA.forEach(inputInfo => {
              if ('selectOption' in inputInfo) {
                const { errorMessage, input, selectOption } = inputInfo;
                selectInput(errorMessage, input, selectOption);
              } else if ('inputValue' in inputInfo) {
                const { errorMessage, input, inputValue } = inputInfo;
                textInput(errorMessage, input, inputValue);
              }
            });

            cy.get('[data-testid="step-1-next-button"]').click();
            cy.get('[data-testid="step-indicator-current-step-2-icon"]');
          });
          it('should allow user to go to step 3 if everything is filled out correctly', () => {
            FORM_INPUT_DATA.forEach(inputInfo => {
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

        describe('International', () => {
          beforeEach(() => {
            cy.get('[data-testid="international-country-btn"]').click();
          });
          const FORM_INPUT_DATA: InputFillType[] = [
            {
              errorMessage: 'primary-contact-name-error-message',
              input: 'contact-primary-name',
              inputValue: 'John Cruz',
            },
            {
              errorMessage: 'primary-secondary-contact-name-error-message',
              input: 'contact-primary-secondary-name',
              inputValue: 'John Cruz II',
            },
            {
              errorMessage: 'primary-contact-title-error-message',
              input: 'contact-primary-title',
              inputValue: 'John Cruz Title',
            },
            {
              errorMessage: 'country-error-message',
              input: 'international-country-input',
              inputValue: 'Some Country',
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

          const ERROR_MESSAGES_DATA_TEST_ID = [
            'primary-contact-name-error-message',
            'primary-secondary-contact-name-error-message',
            'primary-contact-title-error-message',
            'country-error-message',
            'address-1-error-message',
            'city-error-message',
            'postal-code-error-message',
            'phone-error-message',
          ];
          it('should display a validation error message when form is empty', () => {
            ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
              cy.get(`[data-testid="${selector}"]`).should('not.exist');
            });

            cy.get('[data-testid="step-1-next-button"]').click();

            ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
              cy.get(`[data-testid="${selector}"]`).should('exist');
            });
          });
          it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
            FORM_INPUT_DATA.forEach(inputInfo => {
              if ('selectOption' in inputInfo) {
                const { errorMessage, input, selectOption } = inputInfo;
                selectInput(errorMessage, input, selectOption);
              } else if ('inputValue' in inputInfo) {
                const { errorMessage, input, inputValue } = inputInfo;
                textInput(errorMessage, input, inputValue);
              }
            });

            cy.get('[data-testid="step-1-next-button"]').click();
            cy.get('[data-testid="step-indicator-current-step-2-icon"]');
          });
          it('should allow user to go to step 3 if everything is filled out correctly', () => {
            FORM_INPUT_DATA.forEach(inputInfo => {
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

      describe('Estate without an executor/personal representative/fiduciary/etc.', () => {
        beforeEach(() => {
          cy.get('[data-testid="estate-type-radio-option"]').eq(1).click();
        });
        describe('Domestic', () => {
          beforeEach(() => {
            cy.get('[data-testid="domestic-country-btn"]').click();
          });
          const FORM_INPUT_DATA: InputFillType[] = [
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

          const ERROR_MESSAGES_DATA_TEST_ID = [
            'primary-contact-name-error-message',
            'address-1-error-message',
            'city-error-message',
            'state-error-message',
            'postal-code-error-message',
            'phone-error-message',
          ];
          beforeEach(() => {
            cy.get('[data-testid="estate-type-radio-option"]').eq(1).click();
          });
          it('should display a validation error message when form is empty', () => {
            ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
              cy.get(`[data-testid="${selector}"]`).should('not.exist');
            });

            cy.get('[data-testid="step-1-next-button"]').click();

            ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
              cy.get(`[data-testid="${selector}"]`).should('exist');
            });
          });
          it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
            FORM_INPUT_DATA.forEach(inputInfo => {
              if ('selectOption' in inputInfo) {
                const { errorMessage, input, selectOption } = inputInfo;
                selectInput(errorMessage, input, selectOption);
              } else if ('inputValue' in inputInfo) {
                const { errorMessage, input, inputValue } = inputInfo;
                textInput(errorMessage, input, inputValue);
              }
            });

            cy.get('[data-testid="step-1-next-button"]').click();
            cy.get('[data-testid="step-indicator-current-step-2-icon"]');
          });
          it('should allow user to go to step 3 if everything is filled out correctly', () => {
            FORM_INPUT_DATA.forEach(inputInfo => {
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

        describe('International', () => {
          beforeEach(() => {
            cy.get('[data-testid="international-country-btn"]').click();
          });
          const FORM_INPUT_DATA: InputFillType[] = [
            {
              errorMessage: 'primary-contact-name-error-message',
              input: 'contact-primary-name',
              inputValue: 'John Cruz',
            },
            {
              errorMessage: 'country-error-message',
              input: 'international-country-input',
              inputValue: 'Some Country',
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

          const ERROR_MESSAGES_DATA_TEST_ID = [
            'primary-contact-name-error-message',
            'country-error-message',
            'address-1-error-message',
            'city-error-message',
            'postal-code-error-message',
            'phone-error-message',
          ];
          beforeEach(() => {
            cy.get('[data-testid="estate-type-radio-option"]').eq(1).click();
          });
          it('should display a validation error message when form is empty', () => {
            ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
              cy.get(`[data-testid="${selector}"]`).should('not.exist');
            });

            cy.get('[data-testid="step-1-next-button"]').click();

            ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
              cy.get(`[data-testid="${selector}"]`).should('exist');
            });
          });
          it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
            FORM_INPUT_DATA.forEach(inputInfo => {
              if ('selectOption' in inputInfo) {
                const { errorMessage, input, selectOption } = inputInfo;
                selectInput(errorMessage, input, selectOption);
              } else if ('inputValue' in inputInfo) {
                const { errorMessage, input, inputValue } = inputInfo;
                textInput(errorMessage, input, inputValue);
              }
            });

            cy.get('[data-testid="step-1-next-button"]').click();
            cy.get('[data-testid="step-indicator-current-step-2-icon"]');
          });
          it('should allow user to go to step 3 if everything is filled out correctly', () => {
            FORM_INPUT_DATA.forEach(inputInfo => {
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

      describe('Trust', () => {
        beforeEach(() => {
          cy.get('[data-testid="estate-type-radio-option"]').eq(2).click();
        });

        describe('Domestic', () => {
          beforeEach(() => {
            cy.get('[data-testid="domestic-country-btn"]').click();
          });
          const FORM_INPUT_DATA: InputFillType[] = [
            {
              errorMessage: 'primary-contact-name-error-message',
              input: 'contact-primary-name',
              inputValue: 'John Cruz',
            },
            {
              errorMessage: 'primary-secondary-contact-name-error-message',
              input: 'contact-primary-secondary-name',
              inputValue: 'John Cruz II',
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

          const ERROR_MESSAGES_DATA_TEST_ID = [
            'primary-contact-name-error-message',
            'primary-secondary-contact-name-error-message',
            'address-1-error-message',
            'city-error-message',
            'state-error-message',
            'postal-code-error-message',
            'phone-error-message',
          ];

          it('should display a validation error message when form is empty', () => {
            ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
              cy.get(`[data-testid="${selector}"]`).should('not.exist');
            });

            cy.get('[data-testid="step-1-next-button"]').click();

            ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
              cy.get(`[data-testid="${selector}"]`).should('exist');
            });
          });
          it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
            FORM_INPUT_DATA.forEach(inputInfo => {
              if ('selectOption' in inputInfo) {
                const { errorMessage, input, selectOption } = inputInfo;
                selectInput(errorMessage, input, selectOption);
              } else if ('inputValue' in inputInfo) {
                const { errorMessage, input, inputValue } = inputInfo;
                textInput(errorMessage, input, inputValue);
              }
            });

            cy.get('[data-testid="step-1-next-button"]').click();
            cy.get('[data-testid="step-indicator-current-step-2-icon"]');
          });
          it('should allow user to go to step 3 if everything is filled out correctly', () => {
            FORM_INPUT_DATA.forEach(inputInfo => {
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

        describe('International', () => {
          beforeEach(() => {
            cy.get('[data-testid="international-country-btn"]').click();
          });
          const FORM_INPUT_DATA: InputFillType[] = [
            {
              errorMessage: 'primary-contact-name-error-message',
              input: 'contact-primary-name',
              inputValue: 'John Cruz',
            },
            {
              errorMessage: 'primary-secondary-contact-name-error-message',
              input: 'contact-primary-secondary-name',
              inputValue: 'John Cruz II',
            },
            {
              errorMessage: 'country-error-message',
              input: 'international-country-input',
              inputValue: 'Some Country',
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

          const ERROR_MESSAGES_DATA_TEST_ID = [
            'primary-contact-name-error-message',
            'primary-secondary-contact-name-error-message',
            'country-error-message',
            'address-1-error-message',
            'city-error-message',
            'postal-code-error-message',
            'phone-error-message',
          ];
          it('should display a validation error message when form is empty', () => {
            ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
              cy.get(`[data-testid="${selector}"]`).should('not.exist');
            });

            cy.get('[data-testid="step-1-next-button"]').click();

            ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
              cy.get(`[data-testid="${selector}"]`).should('exist');
            });
          });
          it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
            FORM_INPUT_DATA.forEach(inputInfo => {
              if ('selectOption' in inputInfo) {
                const { errorMessage, input, selectOption } = inputInfo;
                selectInput(errorMessage, input, selectOption);
              } else if ('inputValue' in inputInfo) {
                const { errorMessage, input, inputValue } = inputInfo;
                textInput(errorMessage, input, inputValue);
              }
            });

            cy.get('[data-testid="step-1-next-button"]').click();
            cy.get('[data-testid="step-indicator-current-step-2-icon"]');
          });
          it('should allow user to go to step 3 if everything is filled out correctly', () => {
            FORM_INPUT_DATA.forEach(inputInfo => {
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
    });
  });
});
