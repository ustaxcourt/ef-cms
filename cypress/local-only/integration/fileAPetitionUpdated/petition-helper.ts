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

type UploadFileFillType = {
  errorMessage: string;
  input: string;
  uploadFile: string;
};

export type InputFillType = TextFillType | SelectFillType | UploadFileFillType;

export function textInput(
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

export function selectInput(
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

export function fillPetitionFileInformation(filePath: string) {
  cy.get('[data-testid="upload-a-petition-label"').click();
  cy.get('#petition-file').attachFile(filePath);
  cy.get('[data-testid="petition-redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="step-1-next-button"]').click();
}

export function fillGeneratePetitionFileInformation() {
  cy.get('[data-testid="petition-reason--1"]').focus();
  cy.get('[data-testid="petition-reason--1"]').type('REASON 1');
  cy.get('[data-testid="petition-fact--1"]').focus();
  cy.get('[data-testid="petition-fact--1"]').type('FACT 1');
  cy.get('[data-testid="step-1-next-button"]').click();
}

export function fillPetitionerInformation() {
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

  cy.get('[data-testid="step-2-next-button"]').click();
}

export function fillIrsNoticeInformation(filePath: string) {
  cy.get('[data-testid="irs-notice-Yes"]').click();
  cy.get('[data-testid="irs-notice-upload-0"]').attachFile(filePath);
  cy.get('[data-testid="case-type-select"]').select('Deficiency');
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="step-3-next-button"]').click();
}

export function fillIrsNotice(index: number, filePath: string) {
  cy.get(`[data-testid="irs-notice-upload-${index}"]`).attachFile(filePath);
  cy.get('[data-testid="case-type-select"]').eq(index).select('Deficiency');
  cy.get(`[data-testid="irs-notice-tax-year-${index}"]`).type(
    `Tax Year ${index}`,
  );
  cy.get(`input[data-testid="notice-issued-date-${index}-picker"]`)
    .eq(1)
    .type('05/02/2024');
}

export function fillCaseProcedureInformation() {
  cy.get('[data-testid="procedure-type-1"]').click();
  cy.get('[data-testid="preferred-trial-city"]').select('Birmingham, Alabama');
  cy.get('[data-testid="step-4-next-button"]').click();
}

export function fillStinInformation(filePath: string) {
  cy.get('[data-testid="stin-file"]').attachFile(filePath);
  cy.get('[data-testid="step-5-next-button"]').click();
}
