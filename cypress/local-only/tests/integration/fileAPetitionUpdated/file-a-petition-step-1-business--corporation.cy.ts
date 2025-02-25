import { InputFillType, selectInput, textInput } from './petition-helper';
import { attachFile } from '../../../../helpers/file/upload-file';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition: Step 1 - Petitioner Information', () => {
  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
    cy.get('[data-testid="step-indicator-current-step-1-icon"]');
  });

  describe('Business', () => {
    beforeEach(() => {
      cy.get('[data-testid="filing-type-2"').click();
    });

    it('should display all business options', () => {
      const EXPECTED_FILING_TYPES: string[] = [
        'Corporation',
        'Partnership (as the Tax Matters Partner)',
        'Partnership (as a partner other than Tax Matters Partner)',
        'Partnership (as a partnership representative under BBA)',
      ];
      cy.get('.business-type-radio-option').should('have.length', 4);
      cy.get('.business-type-radio-option').each((element, index) => {
        cy.wrap(element).should('have.text', EXPECTED_FILING_TYPES[index]);
      });
    });

    it('should display a validation error message when no business type is selected', () => {
      cy.get('[data-testid="business-type-error-message"]').should('not.exist');

      cy.get('[data-testid="step-1-next-button"]').click();

      cy.get('[data-testid="business-type-error-message"]').should('exist');
    });

    describe('Corporation', () => {
      beforeEach(() => {
        cy.get('.business-type-radio-option').eq(0).click();
      });

      describe('Domestic', () => {
        beforeEach(() => {
          cy.get('[data-testid="domestic-country-btn"]').click();
        });

        it('should display a validation error message when Corporation form is empty', () => {
          const ERROR_MESSAGES_DATA_TEST_ID = [
            'primary-contact-name-error-message',
            'address-1-error-message',
            'city-error-message',
            'state-error-message',
            'postal-code-error-message',
            'phone-error-message',
            'corporate-disclosure-file-error-message',
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
            {
              errorMessage: 'corporate-disclosure-file-error-message',
              input: 'corporate-disclosure-file',
              uploadFile: '../../helpers/file/sample.pdf',
            },
          ];

          ERROR_MESSAGES_DATA_TEST_ID.forEach(inputInfo => {
            if ('selectOption' in inputInfo) {
              const { errorMessage, input, selectOption } = inputInfo;
              selectInput(errorMessage, input, selectOption);
            } else if ('inputValue' in inputInfo) {
              const { errorMessage, input, inputValue } = inputInfo;
              textInput(errorMessage, input, inputValue);
            } else if ('uploadFile' in inputInfo) {
              const { errorMessage, input, uploadFile } = inputInfo;
              cy.get(`[data-testid="${errorMessage}"]`).should('not.exist');
              cy.get('[data-testid="step-1-next-button"]').click();
              cy.get(`[data-testid="${errorMessage}"]`).should('exist');
              attachFile({
                filePath: uploadFile,
                selector: `[data-testid="${input}"]`,
                selectorToAwaitOnSuccess:
                  '[data-testid^="upload-file-success"]',
              });
            }
          });

          cy.get('[data-testid="step-1-next-button"]').click();
          cy.get('[data-testid="step-indicator-current-step-2-icon"]');
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
            {
              errorMessage: 'corporate-disclosure-file-error-message',
              input: 'corporate-disclosure-file',
              uploadFile: '../../helpers/file/sample.pdf',
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
            } else if ('uploadFile' in inputInfo) {
              const { errorMessage, input, uploadFile } = inputInfo;
              cy.get(`[data-testid="${errorMessage}"]`).should('not.exist');
              cy.get('[data-testid="step-1-next-button"]').click();
              cy.get(`[data-testid="${errorMessage}"]`).should('exist');
              attachFile({
                filePath: uploadFile,
                selector: `[data-testid="${input}"]`,
                selectorToAwaitOnSuccess:
                  '[data-testid^="upload-file-success"]',
              });
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

        it('should display a validation error message when Corporation form is empty', () => {
          const ERROR_MESSAGES_DATA_TEST_ID = [
            'primary-contact-name-error-message',
            'country-error-message',
            'address-1-error-message',
            'city-error-message',
            'postal-code-error-message',
            'phone-error-message',
            'corporate-disclosure-file-error-message',
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
            {
              errorMessage: 'corporate-disclosure-file-error-message',
              input: 'corporate-disclosure-file',
              uploadFile: '../../helpers/file/sample.pdf',
            },
          ];

          ERROR_MESSAGES_DATA_TEST_ID.forEach(inputInfo => {
            if ('selectOption' in inputInfo) {
              const { errorMessage, input, selectOption } = inputInfo;
              selectInput(errorMessage, input, selectOption);
            } else if ('inputValue' in inputInfo) {
              const { errorMessage, input, inputValue } = inputInfo;
              textInput(errorMessage, input, inputValue);
            } else if ('uploadFile' in inputInfo) {
              const { errorMessage, input, uploadFile } = inputInfo;
              cy.get(`[data-testid="${errorMessage}"]`).should('not.exist');
              cy.get('[data-testid="step-1-next-button"]').click();
              cy.get(`[data-testid="${errorMessage}"]`).should('exist');
              attachFile({
                filePath: uploadFile,
                selector: `[data-testid="${input}"]`,
                selectorToAwaitOnSuccess:
                  '[data-testid^="upload-file-success"]',
              });
            }
          });

          cy.get('[data-testid="step-1-next-button"]').click();
          cy.get('[data-testid="step-indicator-current-step-2-icon"]');
        });

        it('should allow user to go to step 3 if everything is filled out correctly', () => {
          const ERROR_MESSAGES_DATA_TEST_ID: InputFillType[] = [
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
            {
              errorMessage: 'corporate-disclosure-file-error-message',
              input: 'corporate-disclosure-file',
              uploadFile: '../../helpers/file/sample.pdf',
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
            } else if ('uploadFile' in inputInfo) {
              const { errorMessage, input, uploadFile } = inputInfo;
              cy.get(`[data-testid="${errorMessage}"]`).should('not.exist');
              cy.get('[data-testid="step-1-next-button"]').click();
              cy.get(`[data-testid="${errorMessage}"]`).should('exist');
              attachFile({
                filePath: uploadFile,
                selector: `[data-testid="${input}"]`,
                selectorToAwaitOnSuccess:
                  '[data-testid^="upload-file-success"]',
              });
            }
          });

          cy.get('[data-testid="step-1-next-button"]').click();
          cy.get('[data-testid="step-indicator-current-step-2-icon"]');
        });
      });
    });
  });
});
