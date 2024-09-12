import {
  InputFillType,
  fillPetitionFileInformation,
  fillPetitionerInformation,
  selectInput,
} from './petition-helper';
import {
  loginAsPetitioner,
  loginAsPrivatePractitioner,
} from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition - Step 3 IRS Notices', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  describe('Petitioner', () => {
    beforeEach(() => {
      loginAsPetitioner();
      cy.visit('/file-a-petition/new');

      fillPetitionerInformation();
      fillPetitionFileInformation(VALID_FILE);
    });

    it('should display correct title', () => {
      cy.get('[data-testid="has-irs-notice-legend"]').should(
        'have.text',
        'Did you receive a notice from the IRS?',
      );
    });

    it('should display all the possible options', () => {
      const EXPECTED_HAS_IRS_NOTICE_OPTIONS: string[] = ['Yes', 'No'];

      cy.get('[data-testid^="irs-notice-"]').should('have.length', 2);

      EXPECTED_HAS_IRS_NOTICE_OPTIONS.forEach((option: string) => {
        cy.get(`[data-testid="irs-notice-${option}"]`).should('exist');
      });
    });

    describe('Has IRS Notices', () => {
      beforeEach(() => {
        cy.get('[data-testid="irs-notice-Yes"]').click();

        cy.get('[data-testid="step-3-next-button"]').should('exist');
        cy.get('[data-testid="step-3-next-button"]').should('not.be.disabled');

        cy.get('[data-testid="irs-notice-upload-0"]').attachFile(VALID_FILE);
        cy.get('[data-testid="step-3-next-button"]').should('exist');
        cy.get('[data-testid="step-3-next-button"]').should('be.disabled');

        cy.get('[data-testid="redaction-acknowledgement-label"]').should(
          'exist',
        );
        cy.get('[data-testid="redaction-acknowledgement-label"]').click();

        cy.get('[data-testid="step-3-next-button"]').should('not.be.disabled');
      });

      describe('VALIDATION MESSAGES', () => {
        it('should display validation error messages when user clicks on "Next" button without selecting a case type', () => {
          cy.get('[data-testid="step-3-next-button"]').click();
          cy.get('[data-testid="case-type-0-error-message"]').should('exist');
        });

        it('should do live validation when user leaves input with an invalid response and remove message when user fixes it', () => {
          const ERROR_MESSAGES_DATA_TEST_ID: InputFillType[] = [
            {
              errorMessage: 'case-type-0-error-message',
              input: 'case-type-select',
              selectOption: 'Deficiency',
            },
          ];

          ERROR_MESSAGES_DATA_TEST_ID.forEach(inputInfo => {
            if ('selectOption' in inputInfo) {
              const { errorMessage, input, selectOption } = inputInfo;
              selectInput(errorMessage, input, selectOption);
            }
          });

          cy.get('[data-testid="step-3-next-button"]').click();
          cy.get('[data-testid="step-indicator-current-step-4-icon"]');
        });

        it('should allow user to go to step 3 if everything is filled out correctly', () => {
          const ERROR_MESSAGES_DATA_TEST_ID: InputFillType[] = [
            {
              errorMessage: 'case-type-0-error-message',
              input: 'case-type-select',
              selectOption: 'Deficiency',
            },
          ];

          ERROR_MESSAGES_DATA_TEST_ID.forEach(inputInfo => {
            if ('selectOption' in inputInfo) {
              const { input, selectOption } = inputInfo;
              cy.get(`[data-testid="${input}"]`).scrollIntoView();
              cy.get(`select[data-testid="${input}"]`).select(selectOption);
            }
          });

          cy.get('[data-testid="step-3-next-button"]').click();
          cy.get('[data-testid="step-indicator-current-step-4-icon"]');
        });

        it('should remove the "Add another IRS Notice" Button when there are 5 IRS Notice already', () => {
          cy.get('[data-testid="add-another-irs-notice-button"]').should(
            'exist',
          );
          cy.get('[data-testid="add-another-irs-notice-button"]').click();

          cy.get('[data-testid="add-another-irs-notice-button"]').should(
            'exist',
          );
          cy.get('[data-testid="add-another-irs-notice-button"]').click();

          cy.get('[data-testid="add-another-irs-notice-button"]').should(
            'exist',
          );
          cy.get('[data-testid="add-another-irs-notice-button"]').click();

          cy.get('[data-testid="add-another-irs-notice-button"]').should(
            'exist',
          );
          cy.get('[data-testid="add-another-irs-notice-button"]').click();

          cy.get('[data-testid="add-another-irs-notice-button"]').should(
            'not.exist',
          );
        });
      });
    });

    describe('Does Not Have IRS Notices', () => {
      beforeEach(() => {
        cy.get('[data-testid="irs-notice-No"]').click();
      });

      describe('VALIDATION MESSAGES', () => {
        it('should display validation error messages when user clicks on "Next" button without selecting a case type', () => {
          cy.get('[data-testid="step-3-next-button"]').click();
          cy.get('[data-testid="case-type-root-error-message"]').should(
            'exist',
          );
        });

        it('should do live validation when user leaves input with an invalid response and remove message when user fixes it', () => {
          const ERROR_MESSAGES_DATA_TEST_ID: InputFillType[] = [
            {
              errorMessage: 'case-type-root-error-message',
              input: 'case-type-select',
              selectOption: 'Disclosure',
            },
          ];

          ERROR_MESSAGES_DATA_TEST_ID.forEach(inputInfo => {
            if ('selectOption' in inputInfo) {
              const { errorMessage, input, selectOption } = inputInfo;
              selectInput(errorMessage, input, selectOption);
            }
          });

          cy.get('[data-testid="step-3-next-button"]').click();
          cy.get('[data-testid="step-indicator-current-step-4-icon"]');
        });

        it('should allow user to go to step 3 if everything is filled out correctly', () => {
          const ERROR_MESSAGES_DATA_TEST_ID: InputFillType[] = [
            {
              errorMessage: 'case-type-root-error-message',
              input: 'case-type-select',
              selectOption: 'Disclosure',
            },
          ];

          ERROR_MESSAGES_DATA_TEST_ID.forEach(inputInfo => {
            if ('selectOption' in inputInfo) {
              const { input, selectOption } = inputInfo;
              cy.get(`[data-testid="${input}"]`).scrollIntoView();
              cy.get(`select[data-testid="${input}"]`).select(selectOption);
            }
          });

          cy.get('[data-testid="step-3-next-button"]').click();
          cy.get('[data-testid="step-indicator-current-step-4-icon"]');
        });
      });
    });
  });

  describe('Practitioner', () => {
    beforeEach(() => {
      loginAsPrivatePractitioner();
      cy.visit('/file-a-petition/new');

      fillPetitionerInformation();
      fillPetitionFileInformation(VALID_FILE);
    });

    it('should display correct title', () => {
      cy.get('[data-testid="has-irs-notice-legend"]').should(
        'have.text',
        'Did the petitioner receive a notice from the IRS?',
      );
    });
  });
});
