import {
  InputFillType,
  fillIrsNoticeInformation,
  fillPetitionFileInformation,
  fillPetitionerInformation,
  selectInput,
} from './petition-helper';
import { loginAsPetitioner } from '../../../../helpers/authentication/login-as-helpers';

describe('File a petition - Step 4 Case Procedure & Trial Location', () => {
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');

    fillPetitionerInformation();
    fillPetitionFileInformation(VALID_FILE);
    fillIrsNoticeInformation(VALID_FILE);
  });

  it('should display all the possible options', () => {
    const EXPECTED_CASE_PROCEDURES: string[] = ['Regular case', 'Small case'];
    cy.get('[data-testid^="procedure-type-"]').should('have.length', 2);

    EXPECTED_CASE_PROCEDURES.forEach((option: string, index: number) => {
      cy.get(`[data-testid="procedure-type-${index}"]`).should('exist');
      cy.get(`[data-testid="procedure-type-${index}"]`).should(
        'have.text',
        option,
      );
    });
  });

  it('should display validation error message when user presses "Next" button without selecting a procedure type', () => {
    cy.get('[data-testid="procedure-type-error-message"]').should('not.exist');
    cy.get('[data-testid="step-4-next-button"]').click();
    cy.get('[data-testid="procedure-type-error-message"]').should('exist');
  });

  it('should display validation error message when user presses "Next" button without selecting a procedure type but clear when user makes a selection', () => {
    cy.get('[data-testid="procedure-type-error-message"]').should('not.exist');
    cy.get('[data-testid="step-4-next-button"]').click();
    cy.get('[data-testid="procedure-type-error-message"]').should('exist');

    cy.get('[data-testid="procedure-type-0"]').click();
    cy.get('[data-testid="procedure-type-error-message"]').should('not.exist');
  });

  describe('Regular case', () => {
    beforeEach(() => {
      cy.get('[data-testid="procedure-type-0"]').click();
    });

    it('should display validation error message when user presses "Next" button without selecting a trial location', () => {
      const ERROR_MESSAGES_DATA_TEST_ID = ['trial-city-error-message-0'];

      ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
        cy.get(`[data-testid="${selector}"]`).should('not.exist');
      });

      cy.get('[data-testid="step-4-next-button"]').click();

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
          errorMessage: 'trial-city-error-message-0',
          input: 'preferred-trial-city',
          selectOption: 'Birmingham, Alabama',
        },
      ];

      ERROR_MESSAGES_DATA_TEST_ID.forEach(inputInfo => {
        if ('selectOption' in inputInfo) {
          const { errorMessage, input, selectOption } = inputInfo;
          selectInput(errorMessage, input, selectOption);
        }
      });

      cy.get('[data-testid="step-4-next-button"]').click();
      cy.get('[data-testid="step-indicator-current-step-5-icon"]');
    });

    it('should allow user to go to step 5 if everything is filled out correctly', () => {
      const ERROR_MESSAGES_DATA_TEST_ID: InputFillType[] = [
        {
          errorMessage: 'trial-city-error-message-0',
          input: 'preferred-trial-city',
          selectOption: 'Birmingham, Alabama',
        },
      ];

      ERROR_MESSAGES_DATA_TEST_ID.forEach(inputInfo => {
        if ('selectOption' in inputInfo) {
          const { input, selectOption } = inputInfo;
          cy.get(`[data-testid="${input}"]`).scrollIntoView();
          cy.get(`select[data-testid="${input}"]`).select(selectOption);
        }
      });

      cy.get('[data-testid="step-4-next-button"]').click();
      cy.get('[data-testid="step-indicator-current-step-5-icon"]');
    });
  });

  describe('Small case', () => {
    beforeEach(() => {
      cy.get('[data-testid="procedure-type-1"]').click();
    });

    it('should display validation error message when user presses "Next" button without selecting a trial location', () => {
      const ERROR_MESSAGES_DATA_TEST_ID = ['trial-city-error-message-0'];

      ERROR_MESSAGES_DATA_TEST_ID.forEach((selector: string) => {
        cy.get(`[data-testid="${selector}"]`).should('not.exist');
      });

      cy.get('[data-testid="step-4-next-button"]').click();

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
          errorMessage: 'trial-city-error-message-0',
          input: 'preferred-trial-city',
          selectOption: 'Birmingham, Alabama',
        },
      ];

      ERROR_MESSAGES_DATA_TEST_ID.forEach(inputInfo => {
        if ('selectOption' in inputInfo) {
          const { errorMessage, input, selectOption } = inputInfo;
          selectInput(errorMessage, input, selectOption);
        }
      });

      cy.get('[data-testid="step-4-next-button"]').click();
      cy.get('[data-testid="step-indicator-current-step-5-icon"]');
    });

    it('should allow user to go to step 5 if everything is filled out correctly', () => {
      const ERROR_MESSAGES_DATA_TEST_ID: InputFillType[] = [
        {
          errorMessage: 'trial-city-error-message-0',
          input: 'preferred-trial-city',
          selectOption: 'Birmingham, Alabama',
        },
      ];

      ERROR_MESSAGES_DATA_TEST_ID.forEach(inputInfo => {
        if ('selectOption' in inputInfo) {
          const { input, selectOption } = inputInfo;
          cy.get(`[data-testid="${input}"]`).scrollIntoView();
          cy.get(`select[data-testid="${input}"]`).select(selectOption);
        }
      });

      cy.get('[data-testid="step-4-next-button"]').click();
      cy.get('[data-testid="step-indicator-current-step-5-icon"]');
    });
  });
});
