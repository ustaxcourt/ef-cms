import { InputFillType, selectInput, textInput } from './petition-helper';
import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';

const INTERNATIONAL_FORM_INPUT_DATA: InputFillType[] = [
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

const INTERNATIONAL_ERROR_MESSAGES_DATA_TEST_ID = [
  'primary-contact-name-error-message',
  'primary-secondary-contact-name-error-message',
  'country-error-message',
  'address-1-error-message',
  'city-error-message',
  'postal-code-error-message',
  'phone-error-message',
];

const DOMESTIC_FORM_INPUT_DATA: InputFillType[] = [
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
    selectOption: 'NJ',
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

const DOMESTIC_ERROR_MESSAGES_DATA_TEST_ID = [
  'primary-contact-name-error-message',
  'primary-secondary-contact-name-error-message',
  'address-1-error-message',
  'city-error-message',
  'state-error-message',
  'postal-code-error-message',
  'phone-error-message',
];

describe('File a petition: Step 1 - Petitioner Information', () => {
  describe('Petitioner', () => {
    beforeEach(() => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');
      cy.get('[data-testid="step-indicator-current-step-1-icon"]');
    });
    describe('Other', () => {
      beforeEach(() => {
        cy.get('[data-testid="filing-type-3"').click();
      });

      describe('A minor or legally incompetent person', () => {
        beforeEach(() => {
          cy.get('[data-testid="other-type-radio-option-1"]').click();
        });

        it('should display all minor or legally incompetent person role options', () => {
          const EXPECTED_FILING_TYPES: string[] = [
            'Conservator',
            'Guardian',
            'Custodian',
            'Next friend for a minor (without a guardian, conservator, or other like fiduciary)',
            'Next friend for a legally incompetent person (without a guardian, conservator, or other like fiduciary)',
          ];

          EXPECTED_FILING_TYPES.forEach((filingType, index) => {
            cy.get(
              `[data-testid="minor-incompetent-type-radio-option-${index}"]`,
            ).should('have.text', filingType);
          });
        });

        it('should display a validation error message when no minor or legally incompetent person role option is selected', () => {
          cy.get('[data-testid="minor-incompetent-type-error-message"]').should(
            'not.exist',
          );

          cy.get('[data-testid="step-1-next-button"]').click();

          cy.get('[data-testid="minor-incompetent-type-error-message"]').should(
            'exist',
          );
        });

        it('should display correct other type title', () => {
          cy.get('[data-testid="estate-type-legend"]').should(
            'have.text',
            'What is your role in filing for this minor or legally incompetent person?',
          );
        });

        describe('Conservator', () => {
          beforeEach(() => {
            cy.get(
              '[data-testid="minor-incompetent-type-radio-option-0"]',
            ).click();
          });
          describe('Domestic', () => {
            beforeEach(() => {
              cy.get('[data-testid="domestic-country-btn"]').click();
            });
            it('should display a validation error message when form is empty', () => {
              DOMESTIC_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('not.exist');
                },
              );

              cy.get('[data-testid="step-1-next-button"]').click();

              DOMESTIC_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('exist');
                },
              );
            });
            it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
              DOMESTIC_FORM_INPUT_DATA.forEach(inputInfo => {
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
              DOMESTIC_FORM_INPUT_DATA.forEach(inputInfo => {
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
            it('should display a validation error message when form is empty', () => {
              INTERNATIONAL_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('not.exist');
                },
              );

              cy.get('[data-testid="step-1-next-button"]').click();

              INTERNATIONAL_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('exist');
                },
              );
            });
            it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
              INTERNATIONAL_FORM_INPUT_DATA.forEach(inputInfo => {
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
              INTERNATIONAL_FORM_INPUT_DATA.forEach(inputInfo => {
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

        describe('Guardian', () => {
          beforeEach(() => {
            cy.get(
              '[data-testid="minor-incompetent-type-radio-option-1"]',
            ).click();
          });
          describe('Domestic', () => {
            beforeEach(() => {
              cy.get('[data-testid="domestic-country-btn"]').click();
            });
            it('should display a validation error message when form is empty', () => {
              DOMESTIC_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('not.exist');
                },
              );

              cy.get('[data-testid="step-1-next-button"]').click();

              DOMESTIC_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('exist');
                },
              );
            });
            it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
              DOMESTIC_FORM_INPUT_DATA.forEach(inputInfo => {
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
              DOMESTIC_FORM_INPUT_DATA.forEach(inputInfo => {
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

            it('should display a validation error message when form is empty', () => {
              INTERNATIONAL_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('not.exist');
                },
              );

              cy.get('[data-testid="step-1-next-button"]').click();

              INTERNATIONAL_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('exist');
                },
              );
            });
            it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
              INTERNATIONAL_FORM_INPUT_DATA.forEach(inputInfo => {
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
              INTERNATIONAL_FORM_INPUT_DATA.forEach(inputInfo => {
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

        describe('Custodian', () => {
          beforeEach(() => {
            cy.get(
              '[data-testid="minor-incompetent-type-radio-option-2"]',
            ).click();
          });
          describe('Domestic', () => {
            beforeEach(() => {
              cy.get('[data-testid="domestic-country-btn"]').click();
            });
            it('should display a validation error message when form is empty', () => {
              DOMESTIC_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('not.exist');
                },
              );

              cy.get('[data-testid="step-1-next-button"]').click();

              DOMESTIC_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('exist');
                },
              );
            });
            it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
              DOMESTIC_FORM_INPUT_DATA.forEach(inputInfo => {
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
              DOMESTIC_FORM_INPUT_DATA.forEach(inputInfo => {
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
            it('should display a validation error message when form is empty', () => {
              INTERNATIONAL_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('not.exist');
                },
              );

              cy.get('[data-testid="step-1-next-button"]').click();

              INTERNATIONAL_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('exist');
                },
              );
            });
            it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
              INTERNATIONAL_FORM_INPUT_DATA.forEach(inputInfo => {
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
              INTERNATIONAL_FORM_INPUT_DATA.forEach(inputInfo => {
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

        describe('Next friend for a minor (without a guardian, conservator, or other like fiduciary)', () => {
          beforeEach(() => {
            cy.get(
              '[data-testid="minor-incompetent-type-radio-option-3"]',
            ).click();
          });
          describe('Domestic', () => {
            beforeEach(() => {
              cy.get('[data-testid="domestic-country-btn"]').click();
            });
            it('should display a validation error message when form is empty', () => {
              DOMESTIC_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('not.exist');
                },
              );

              cy.get('[data-testid="step-1-next-button"]').click();

              DOMESTIC_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('exist');
                },
              );
            });
            it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
              DOMESTIC_FORM_INPUT_DATA.forEach(inputInfo => {
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
              DOMESTIC_FORM_INPUT_DATA.forEach(inputInfo => {
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
            it('should display a validation error message when form is empty', () => {
              INTERNATIONAL_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('not.exist');
                },
              );

              cy.get('[data-testid="step-1-next-button"]').click();

              INTERNATIONAL_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('exist');
                },
              );
            });
            it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
              INTERNATIONAL_FORM_INPUT_DATA.forEach(inputInfo => {
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
              INTERNATIONAL_FORM_INPUT_DATA.forEach(inputInfo => {
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

        describe('Next friend for a legally incompetent person (without a guardian, conservator, or other like fiduciary)', () => {
          beforeEach(() => {
            cy.get(
              '[data-testid="minor-incompetent-type-radio-option-4"]',
            ).click();
          });
          describe('Domestic', () => {
            beforeEach(() => {
              cy.get('[data-testid="domestic-country-btn"]').click();
            });
            it('should display a validation error message when form is empty', () => {
              DOMESTIC_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('not.exist');
                },
              );

              cy.get('[data-testid="step-1-next-button"]').click();

              DOMESTIC_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('exist');
                },
              );
            });
            it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
              DOMESTIC_FORM_INPUT_DATA.forEach(inputInfo => {
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
              DOMESTIC_FORM_INPUT_DATA.forEach(inputInfo => {
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
            it('should display a validation error message when form is empty', () => {
              INTERNATIONAL_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('not.exist');
                },
              );

              cy.get('[data-testid="step-1-next-button"]').click();

              INTERNATIONAL_ERROR_MESSAGES_DATA_TEST_ID.forEach(
                (selector: string) => {
                  cy.get(`[data-testid="${selector}"]`).should('exist');
                },
              );
            });
            it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
              INTERNATIONAL_FORM_INPUT_DATA.forEach(inputInfo => {
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
              INTERNATIONAL_FORM_INPUT_DATA.forEach(inputInfo => {
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

  describe('Practitioner', () => {
    describe('Other Filing Options', () => {
      it('should display other filing options', () => {
        loginAsPrivatePractitioner();
        cy.visit('/file-a-petition/new');
        cy.get('[data-testid="filing-type-3"').click();

        cy.get('[data-testid="other-type-radio-option-0"]').should(
          'have.text',
          'An estate or trust',
        );
        cy.get('[data-testid="other-type-radio-option-1"]').should(
          'have.text',
          'Donor',
        );
        cy.get('[data-testid="other-type-radio-option-2"]').should(
          'have.text',
          'Transferee',
        );
        cy.get('[data-testid="other-type-radio-option-3"]').should(
          'have.text',
          'Deceased Spouse',
        );
      });
    });
  });
});
