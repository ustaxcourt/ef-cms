import { InputFillType, selectInput, textInput } from './petition-helper';
import { loginAsPetitioner } from '../../../helpers/authentication/login-as-helpers';

describe('File a petition: Step 1 - Petitioner Information', () => {
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

  it('should display a validaiton error message if user does not select filing type', () => {
    cy.get('[data-testid="filling-type-error-message"]').should('not.exist');

    cy.get('[data-testid="step-1-next-button"]').click();

    cy.get('[data-testid="filling-type-error-message"]').should('exist');
  });

  describe('Myself and my spouse', () => {
    beforeEach(() => {
      cy.get('[data-testid="filing-type-1"').click();
    });

    describe('Country - United States', () => {
      beforeEach(() => {
        cy.get('[data-testid="domestic-country-btn"').click();
      });

      it('should display all error validation messages when user leaves form empty', () => {
        const ERROR_MESSAGES_DATA_TEST_ID = [
          'primary-contact-name-error-message',
          'address-1-error-message',
          'city-error-message',
          'state-error-message',
          'postal-code-error-message',
          'phone-error-message',
          'is-spouse-deceased-error-message',
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

      describe('Spouse is Deceased', () => {
        beforeEach(() => {
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

          cy.get('[data-testid="is-spouse-deceased-0"]').click();
        });

        it('should display error validation messages if Spouse is Deceased form is empty', () => {
          const ERROR_MESSAGES_DATA_TEST_ID = [
            'secondary-contact-name-error-message',
            'in-care-of-contactSecondary-error-message',
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
              errorMessage: 'secondary-contact-name-error-message',
              input: 'contact-secondary-name',
              inputValue: 'John Cruz',
            },
            {
              errorMessage: 'in-care-of-contactSecondary-error-message',
              input: 'contactSecondary-in-care-of',
              inputValue: 'In Care Of Value',
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

          cy.get('[data-testid="step-1-next-button"]').click();
          cy.get('[data-testid="step-indicator-current-step-2-icon"]');
        });

        it('should allow user to go to step 3 if everything is filled out correctly', () => {
          const ERROR_MESSAGES_DATA_TEST_ID: InputFillType[] = [
            {
              errorMessage: 'secondary-contact-name-error-message',
              input: 'contact-secondary-name',
              inputValue: 'John Cruz',
            },
            {
              errorMessage: 'in-care-of-contactSecondary-error-message',
              input: 'contactSecondary-in-care-of',
              inputValue: 'In Care Of Value',
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

      describe('Spouse is not Deceased', () => {
        beforeEach(() => {
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

          cy.get('[data-testid="is-spouse-deceased-1"]').click();
        });

        it('should display error validation messages if Spouse is Deceased form is empty', () => {
          const ERROR_MESSAGES_DATA_TEST_ID = [
            'has-spouse-consent-error-message',
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

        describe('I have Spouse Consent - do not register email', () => {
          beforeEach(() => {
            cy.get('[data-testid="have-spouse-consent-label"').click();
          });

          it('should display error messages when user leaves spouse form empty', () => {
            const ERROR_MESSAGES_DATA_TEST_ID = [
              'secondary-contact-name-error-message',
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
                errorMessage: 'secondary-contact-name-error-message',
                input: 'contact-secondary-name',
                inputValue: 'John Cruz',
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

            cy.get('[data-testid="step-1-next-button"]').click();
            cy.get('[data-testid="step-indicator-current-step-2-icon"]');
          });

          it('should allow user to go to step 3 if everything is filled out correctly', () => {
            const ERROR_MESSAGES_DATA_TEST_ID: InputFillType[] = [
              {
                errorMessage: 'secondary-contact-name-error-message',
                input: 'contact-secondary-name',
                inputValue: 'John Cruz',
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

        describe('I have Spouse Consent - register email', () => {
          beforeEach(() => {
            cy.get('[data-testid="have-spouse-consent-label"').click();
            cy.get(
              '[data-testid="register-email-address-provided-above-for-electronic-filing-and-service-label"',
            ).click();
          });

          it('should display error messages when user leaves spouse form empty', () => {
            const ERROR_MESSAGES_DATA_TEST_ID = [
              'secondary-contact-name-error-message',
              'email-error-message',
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
                errorMessage: 'secondary-contact-name-error-message',
                input: 'contact-secondary-name',
                inputValue: 'John Cruz',
              },
              {
                errorMessage: 'email-error-message',
                input: 'contact-secondary-email',
                inputValue: 'test@test.com',
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

            cy.get('[data-testid="step-1-next-button"]').click();
            cy.get('[data-testid="step-indicator-current-step-2-icon"]');
          });

          it('should allow user to go to step 3 if everything is filled out correctly', () => {
            const ERROR_MESSAGES_DATA_TEST_ID: InputFillType[] = [
              {
                errorMessage: 'secondary-contact-name-error-message',
                input: 'contact-secondary-name',
                inputValue: 'John Cruz',
              },
              {
                errorMessage: 'email-error-message',
                input: 'contact-secondary-email',
                inputValue: 'test@test.com',
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
    });
  });
});
