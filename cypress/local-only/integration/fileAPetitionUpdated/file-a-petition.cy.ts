import { loginAsPetitioner } from '../../../helpers/authentication/login-as-helpers';

type TextFillType = {
  errorMessage: string;
  input: string;
  inputValue: string;
};

type SelectFillType = {
  errorMessage: string;
  input: string;
  selectOption: string;
};

type InputFillType = TextFillType | SelectFillType;

describe('File a petition', () => {
  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
  });

  describe('Step 1 - Petition', () => {
    beforeEach(() => {
      cy.get('[data-testid="step-indicator-current-step-1-icon"]');
    });

    describe('Auto generate Petition', () => {
      describe('VALIDATION MESSAGES', () => {
        it('should display error messages when user presses "Next" button without filling reason and fact', () => {
          cy.get('[data-testid="step-1-next-button"]').click();

          cy.get('[data-testid="error_message_petitionReasons[0]"]').should(
            'exist',
          );

          cy.get('[data-testid="error_message_petitionFacts[0]"]').should(
            'exist',
          );
        });

        it('should remove any error message when the user starts typing/changing the input', () => {
          cy.get('[data-testid="step-1-next-button"]').click();

          cy.get('[data-testid="error_message_petitionReasons[0]"]').should(
            'exist',
          );

          cy.get('[data-testid="error_message_petitionFacts[0]"]').should(
            'exist',
          );

          cy.get('[data-testid="petition-reason--1"]').focus();
          cy.get('[data-testid="petition-reason--1"]').type('REASON 1');

          cy.get('[data-testid="error_message_petitionReasons[0]"]').should(
            'not.exist',
          );

          cy.get('[data-testid="petition-fact--1"]').focus();
          cy.get('[data-testid="petition-fact--1"]').type('FACT 1');

          cy.get('[data-testid="error_message_petitionFacts[0]"]').should(
            'not.exist',
          );
        });

        it('should ignore unfilled extra facts and reasons if they are not filled in', () => {
          cy.get('[data-testid="petition-reason--1"]').focus();
          cy.get('[data-testid="petition-reason--1"]').type('REASON 1');

          cy.get('[data-testid="error_message_petitionReasons[0]"]').should(
            'not.exist',
          );

          cy.get('[data-testid="petition-fact--1"]').focus();
          cy.get('[data-testid="petition-fact--1"]').type('FACT 1');

          cy.get('[data-testid="add-another-reason-link-button"').click();
          cy.get('[data-testid="add-another-reason-link-button"').click();

          cy.get('[data-testid="add-another-fact-link-button"').click();
          cy.get('[data-testid="add-another-fact-link-button"').click();

          cy.get('[data-testid="petition-reason-0"').should('exist');
          cy.get('[data-testid="petition-reason-1"').should('exist');

          cy.get('[data-testid="petition-fact-0"').should('exist');
          cy.get('[data-testid="petition-fact-1"').should('exist');

          cy.get('[data-testid="step-1-next-button"]').click();
          cy.get('[data-testid="step-indicator-current-step-2-icon"]');
        });

        it('should be able to navigate to step 2 when the user fills in reason and fact correctly', () => {
          cy.get('[data-testid="petition-reason--1"]').focus();
          cy.get('[data-testid="petition-reason--1"]').type('REASON 1');

          cy.get('[data-testid="petition-fact--1"]').focus();
          cy.get('[data-testid="petition-fact--1"]').type('FACT 1');

          cy.get('[data-testid="step-1-next-button"]').click();
          cy.get('[data-testid="step-indicator-current-step-2-icon"]');
        });
      });
    });

    describe('Upload PDF', () => {
      beforeEach(() => {
        cy.get('[data-testid="upload-a-petition-label"').should('exist');
        cy.get('[data-testid="upload-a-petition-label"').click();

        cy.get('[data-testid="step-1-next-button"]').should('exist');
        cy.get('[data-testid="step-1-next-button"]').should('be.disabled');

        cy.get(
          '[data-testid="petition-redaction-acknowledgement-label"]',
        ).should('exist');
        cy.get(
          '[data-testid="petition-redaction-acknowledgement-label"]',
        ).click();

        cy.get('[data-testid="step-1-next-button"]').should('not.be.disabled');
      });

      describe('VALIDATION MESSAGES', () => {
        it('should throw an error if user presses "Next" button without uploading a file', () => {
          cy.get('[data-testid="step-1-next-button"]').click();

          cy.get('[data-testid="petition-error-message-0"]').should('exist');
        });

        it('should remove error message when user uploads a file', () => {
          cy.get('[data-testid="step-1-next-button"]').click();

          cy.get('[data-testid="petition-error-message-0"]').should('exist');

          cy.get('#petition-file').attachFile('../../helpers/file/sample.pdf');

          cy.get('[data-testid="petition-error-message-0"]').should(
            'not.exist',
          );
        });

        it('should be able to navigate to step 2 when the user uploads a petition correctly', () => {
          cy.get('#petition-file').attachFile('../../helpers/file/sample.pdf');

          cy.get('[data-testid="petition-error-message-0"]').should(
            'not.exist',
          );
        });
      });
    });
  });

  describe('Step 2 - Petitioner Information', () => {
    describe('Step 1 is auto Generated', () => {
      beforeEach(() => {
        cy.get('[data-testid="petition-reason--1"]').focus();
        cy.get('[data-testid="petition-reason--1"]').type('REASON 1');

        cy.get('[data-testid="petition-fact--1"]').focus();
        cy.get('[data-testid="petition-fact--1"]').type('FACT 1');

        cy.get('[data-testid="step-1-next-button"]').click();
        cy.get('[data-testid="step-indicator-current-step-2-icon"]');
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
        cy.get('[data-testid="filling-type-error-message"]').should(
          'not.exist',
        );

        cy.get('[data-testid="step-2-next-button"]').click();

        cy.get('[data-testid="filling-type-error-message"]').should('exist');
      });

      describe('Myself', () => {
        beforeEach(() => {
          cy.get('[data-testid="filing-type-0"').click();
        });

        it('should display validation error messages to all required fields left empty', () => {
          const ERROR_MESSAGES_DATA_TEST_ID = [
            'primary-contact-name-error-message',
            'address-1-error-message',
            'city-error-message',
            'state-error-message',
            'postal-code-error-message',
            'place-of-legal-residence-error-message',
            'phone-error-message',
          ];

          ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
            cy.get(`[data-testid="${selector}"]`).should('not.exist');
          });

          cy.get('[data-testid="step-2-next-button"]').click();

          ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
            cy.get(`[data-testid="${selector}"]`).should('exist');
          });
        });

        it('should do live validation when user leaves input with an invalid response and remove messaeg when user fixes it', () => {
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
              errorMessage: 'place-of-legal-residence-error-message',
              input: 'contactPrimary.placeOfLegalResidence',
              selectOption: 'CO',
            },
            {
              errorMessage: 'phone-error-message',
              input: 'phone',
              inputValue: 'Test Phone',
            },
          ];

          ERROR_MESSAGES_DATA_TEST_ID.forEach(inputInfo => {
            if ('selectOption' in inputInfo) {
              const { errorMessage, input, selectOption } = inputInfo;
              selectInput(errorMessage, input, selectOption);
            } else {
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
              errorMessage: 'place-of-legal-residence-error-message',
              input: 'contactPrimary.placeOfLegalResidence',
              selectOption: 'CO',
            },
            {
              errorMessage: 'phone-error-message',
              input: 'phone',
              inputValue: 'Test Phone',
            },
          ];

          ERROR_MESSAGES_DATA_TEST_ID.forEach(inputInfo => {
            if ('selectOption' in inputInfo) {
              const { input, selectOption } = inputInfo;
              cy.get(`[data-testid="${input}"]`).scrollIntoView();
              cy.get(`select[data-testid="${input}"]`).select(selectOption);
            } else {
              const { input, inputValue } = inputInfo;
              cy.get(`[data-testid="${input}"]`).scrollIntoView();
              cy.get(`[data-testid="${input}"]`).type(inputValue);
            }
          });

          cy.get('[data-testid="step-2-next-button"]').click();
          cy.get('[data-testid="step-indicator-current-step-3-icon"]');
        });
      });
    });

    describe('Step 1 is Uploaded', () => {
      beforeEach(() => {
        cy.get('[data-testid="upload-a-petition-label"').should('exist');
        cy.get('[data-testid="upload-a-petition-label"').click();

        cy.get(
          '[data-testid="petition-redaction-acknowledgement-label"]',
        ).click();
        cy.get('#petition-file').attachFile('../../helpers/file/sample.pdf');

        cy.get('[data-testid="step-1-next-button"]').click();
        cy.get('[data-testid="step-indicator-current-step-2-icon"]');
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
        cy.get('[data-testid="filling-type-error-message"]').should(
          'not.exist',
        );

        cy.get('[data-testid="step-2-next-button"]').click();

        cy.get('[data-testid="filling-type-error-message"]').should('exist');
      });

      describe('Myself', () => {
        beforeEach(() => {
          cy.get('[data-testid="filing-type-0"').click();
        });

        it('should not display an input for "place of legal residence" since petition was uploaded', () => {
          cy.get('[data-testid="contactPrimary.placeOfLegalResidence"]').should(
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

          cy.get('[data-testid="step-2-next-button"]').click();

          ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
            cy.get(`[data-testid="${selector}"]`).should('exist');
          });
        });

        it('should do live validation when user leaves input with an invalid response and remove messaeg when user fixes it', () => {
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
              input: 'phone',
              inputValue: 'Test Phone',
            },
          ];

          ERROR_MESSAGES_DATA_TEST_ID.forEach(inputInfo => {
            if ('selectOption' in inputInfo) {
              const { errorMessage, input, selectOption } = inputInfo;
              selectInput(errorMessage, input, selectOption);
            } else {
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
              input: 'phone',
              inputValue: 'Test Phone',
            },
          ];

          ERROR_MESSAGES_DATA_TEST_ID.forEach(inputInfo => {
            if ('selectOption' in inputInfo) {
              const { input, selectOption } = inputInfo;
              cy.get(`[data-testid="${input}"]`).scrollIntoView();
              cy.get(`select[data-testid="${input}"]`).select(selectOption);
            } else {
              const { input, inputValue } = inputInfo;
              cy.get(`[data-testid="${input}"]`).scrollIntoView();
              cy.get(`[data-testid="${input}"]`).type(inputValue);
            }
          });

          cy.get('[data-testid="step-2-next-button"]').click();
          cy.get('[data-testid="step-indicator-current-step-3-icon"]');
        });
      });
    });
  });
});

function textInput(
  errorMessageSelector: string,
  inputSelector: string,
  inputValue: string,
) {
  cy.get(`[data-testid="${errorMessageSelector}"]`).should('not.exist');
  cy.get(`[data-testid="${inputSelector}"]`).scrollIntoView();
  cy.get(`[data-testid="${inputSelector}"]`).should('exist');
  cy.get(`[data-testid="${inputSelector}"]`).focus();
  cy.get(`[data-testid="${inputSelector}"]`).blur();
  cy.get(`[data-testid="${errorMessageSelector}"]`).should('exist');
  cy.get(`[data-testid="${inputSelector}"]`).focus();
  cy.get(`[data-testid="${inputSelector}"]`).type(inputValue);
  cy.get(`[data-testid="${inputSelector}"]`).blur();
  cy.get(`[data-testid="${errorMessageSelector}"]`).should('not.exist');
}

function selectInput(
  errorMessageSelector: string,
  selectSelector: string,
  optionValue: string,
) {
  cy.get(`[data-testid="${errorMessageSelector}"]`).should('not.exist');
  cy.get(`[data-testid="${selectSelector}"]`).scrollIntoView();
  cy.get(`[data-testid="${selectSelector}"]`).should('exist');
  cy.get(`[data-testid="${selectSelector}"]`).focus();
  cy.get(`[data-testid="${selectSelector}"]`).blur();
  cy.get(`[data-testid="${errorMessageSelector}"]`).should('exist');
  cy.get(`[data-testid="${selectSelector}"]`).focus();
  cy.get(`select[data-testid="${selectSelector}"]`).select(optionValue);
  cy.get(`[data-testid="${errorMessageSelector}"]`).should('not.exist');
}
