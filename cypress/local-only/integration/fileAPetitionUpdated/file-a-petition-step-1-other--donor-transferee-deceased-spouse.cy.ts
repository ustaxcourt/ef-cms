import { InputFillType, selectInput, textInput } from './petition-helper';
import { loginAsPetitioner } from '../../../helpers/authentication/login-as-helpers';

const INTERNATIONAL_FORM_INPUT_DATA: InputFillType[] = [
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

const INTERNATIONAL_ERROR_MESSAGES_DATA_TEST_ID = [
  'primary-contact-name-error-message',
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
  'address-1-error-message',
  'city-error-message',
  'state-error-message',
  'postal-code-error-message',
  'phone-error-message',
];

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

    describe('Donor', () => {
      beforeEach(() => {
        cy.get('[data-testid="other-radio-option"]').eq(2).click();
      });
      describe('Domestic', () => {
        beforeEach(() => {
          cy.get('[data-testid="domestic-country-btn"]').click();
        });
        it('should display a validation error message when form is empty', () => {
          DOMESTIC_ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
            cy.get(`[data-testid="${selector}"]`).should('not.exist');
          });

          cy.get('[data-testid="step-1-next-button"]').click();

          DOMESTIC_ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
            cy.get(`[data-testid="${selector}"]`).should('exist');
          });
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

    describe('Transferee', () => {
      beforeEach(() => {
        cy.get('[data-testid="other-radio-option"]').eq(3).click();
      });
      describe('Domestic', () => {
        beforeEach(() => {
          cy.get('[data-testid="domestic-country-btn"]').click();
        });
        it('should display a validation error message when form is empty', () => {
          DOMESTIC_ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
            cy.get(`[data-testid="${selector}"]`).should('not.exist');
          });

          cy.get('[data-testid="step-1-next-button"]').click();

          DOMESTIC_ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
            cy.get(`[data-testid="${selector}"]`).should('exist');
          });
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

    describe('Deceased Spouse', () => {
      beforeEach(() => {
        cy.get('[data-testid="other-radio-option"]').eq(4).click();
      });
      describe('Domestic', () => {
        beforeEach(() => {
          cy.get('[data-testid="domestic-country-btn"]').click();
        });
        it('should display a validation error message when form is empty', () => {
          [
            ...DOMESTIC_ERROR_MESSAGES_DATA_TEST_ID,
            'primary-secondary-contact-name-error-message',
          ].forEach((selector: string) => {
            cy.get(`[data-testid="${selector}"]`).should('not.exist');
          });

          cy.get('[data-testid="step-1-next-button"]').click();

          [
            ...DOMESTIC_ERROR_MESSAGES_DATA_TEST_ID,
            'primary-secondary-contact-name-error-message',
          ].forEach((selector: string) => {
            cy.get(`[data-testid="${selector}"]`).should('exist');
          });
        });
        it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
          [
            ...DOMESTIC_FORM_INPUT_DATA,
            {
              errorMessage: 'primary-secondary-contact-name-error-message',
              input: 'contact-primary-secondary-name',
              inputValue: 'John Cruz II',
            },
          ].forEach(inputInfo => {
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
          [
            ...DOMESTIC_FORM_INPUT_DATA,
            {
              errorMessage: 'primary-secondary-contact-name-error-message',
              input: 'contact-primary-secondary-name',
              inputValue: 'John Cruz II',
            },
          ].forEach(inputInfo => {
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
          [
            ...INTERNATIONAL_ERROR_MESSAGES_DATA_TEST_ID,
            'primary-secondary-contact-name-error-message',
          ].forEach((selector: string) => {
            cy.get(`[data-testid="${selector}"]`).should('not.exist');
          });

          cy.get('[data-testid="step-1-next-button"]').click();

          [
            ...INTERNATIONAL_ERROR_MESSAGES_DATA_TEST_ID,
            'primary-secondary-contact-name-error-message',
          ].forEach((selector: string) => {
            cy.get(`[data-testid="${selector}"]`).should('exist');
          });
        });
        it('should run live validation when user leaves input with an invalid response and remove validation message when the user fixes it', () => {
          [
            ...INTERNATIONAL_FORM_INPUT_DATA,
            {
              errorMessage: 'primary-secondary-contact-name-error-message',
              input: 'contact-primary-secondary-name',
              inputValue: 'John Cruz II',
            },
          ].forEach(inputInfo => {
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
          [
            ...INTERNATIONAL_FORM_INPUT_DATA,
            {
              errorMessage: 'primary-secondary-contact-name-error-message',
              input: 'contact-primary-secondary-name',
              inputValue: 'John Cruz II',
            },
          ].forEach(inputInfo => {
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
