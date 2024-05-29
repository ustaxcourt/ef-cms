import { InputFillType } from './petition-helper';
import { loginAsPetitioner } from '../../../helpers/authentication/login-as-helpers';

describe('File a petition - Corrupted Files', () => {
  const CORRUPTED_FILE = '../../helpers/file/corrupt-pdf.pdf';
  const VALID_FILE = '../../helpers/file/sample.pdf';

  beforeEach(() => {
    loginAsPetitioner();
    cy.visit('/file-a-petition/new');
  });

  it('should display modal when a corrupted file is being used for petition', () => {
    fillPetitionFileInformation(CORRUPTED_FILE);

    fillPetitionerInformation();

    fillIrsNoticeInformation(VALID_FILE);

    fillCaseProcedureInformation();

    fillStinInformation(VALID_FILE);

    cy.get('[data-testid="petition-review-submit-document"]').click();
    cy.get('[data-testid="file-upload-error-modal"]').should('exist');
  });

  it('should display modal when a corrupted file is being used for IRS notice', () => {
    fillPetitionFileInformation(VALID_FILE);

    fillPetitionerInformation();

    fillIrsNoticeInformation(CORRUPTED_FILE);

    fillCaseProcedureInformation();

    fillStinInformation(VALID_FILE);

    cy.get('[data-testid="petition-review-submit-document"]').click();
    cy.get('[data-testid="file-upload-error-modal"]').should('exist');
  });

  it('should display modal when a corrupted file is being used for STIN', () => {
    fillPetitionFileInformation(VALID_FILE);

    fillPetitionerInformation();

    fillIrsNoticeInformation(VALID_FILE);

    fillCaseProcedureInformation();

    fillStinInformation(CORRUPTED_FILE);

    cy.get('[data-testid="petition-review-submit-document"]').click();
    cy.get('[data-testid="file-upload-error-modal"]').should('exist');
  });

  it('should successfully file a petition when all PDF being uploaded are valid', () => {
    fillPetitionFileInformation(VALID_FILE);

    fillPetitionerInformation();

    fillIrsNoticeInformation(VALID_FILE);

    fillCaseProcedureInformation();

    fillStinInformation(VALID_FILE);

    cy.get('[data-testid="petition-review-submit-document"]').click();

    cy.get('[data-testid="success-alert"]').contains(
      'Your case has been assigned docket number',
    );
  });
});

function fillPetitionFileInformation(filePath: string) {
  cy.get('[data-testid="upload-a-petition-label"').click();
  cy.get('#petition-file').attachFile(filePath);
  cy.get('[data-testid="petition-redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="step-1-next-button"]').click();
}

function fillPetitionerInformation() {
  cy.get('[data-testid="filing-type-0"').click();
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
    } else if ('inputValue' in inputInfo) {
      const { input, inputValue } = inputInfo;
      cy.get(`[data-testid="${input}"]`).scrollIntoView();
      cy.get(`[data-testid="${input}"]`).type(inputValue);
    }
  });

  cy.get('[data-testid="step-2-next-button"]').click();
}

function fillIrsNoticeInformation(filePath: string) {
  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="irs-notice-upload-0"]').attachFile(filePath);
  cy.get('[data-testid="case-type-select"]').select('Deficiency');
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="step-3-next-button"]').click();
}

function fillCaseProcedureInformation() {
  cy.get('[data-testid="procedure-type-0"]').click();
  cy.get('[data-testid="preferred-trial-city"]').select('Birmingham, Alabama');
  cy.get('[data-testid="step-4-next-button"]').click();
}

function fillStinInformation(filePath: string) {
  cy.get('[data-testid="stin-file"]').attachFile(filePath);
  cy.get('[data-testid="step-5-next-button"]').click();
}
