import { ProcedureType } from '../../../../../shared/src/business/entities/EntityConstants';
import { attachFile } from '../../../../helpers/file/upload-file';

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
  attachFile({
    filePath,
    selector: '#petition-file',
    selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
  });
  cy.get('[data-testid="petition-redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="step-2-next-button"]').click();
}

export function fillGeneratePetitionFileInformation(fillMultiple = false) {
  cy.get('[data-testid="petition-reason--1"]').focus();
  cy.get('[data-testid="petition-reason--1"]').type('REASON 1');
  if (fillMultiple) {
    cy.get('[data-testid="add-another-reason-link-button"]').click();
    cy.get('[data-testid="petition-reason-0"]').focus();
    cy.get('[data-testid="petition-reason-0"]').type('REASON 2');
  }
  cy.get('[data-testid="petition-fact--1"]').focus();
  cy.get('[data-testid="petition-fact--1"]').type('FACT 1');
  if (fillMultiple) {
    cy.get('[data-testid="add-another-fact-link-button"]').click();
    cy.get('[data-testid="petition-fact-0"]').focus();
    cy.get('[data-testid="petition-fact-0"]').type('FACT 2');
  }
  cy.get('[data-testid="step-2-next-button"]').click();
}

export function fillPetitionerAndSpouseInformation(addPhone: boolean = false) {
  cy.get('[data-testid="filing-type-1"').click();
  cy.get('[data-testid="contact-primary-name"]').type('John');
  cy.get('[data-testid="contactPrimary.address1"]').type('111 South West St.');
  cy.get('[data-testid="contactPrimary.city"]').type('Orlando');
  cy.get('[data-testid="contactPrimary.state"]').select('AL');
  cy.get('[data-testid="contactPrimary.postalCode"]').type('33233');
  cy.get('[data-testid="contactPrimary-placeOfLegalResidence"]').select('AL');
  cy.get('[data-testid="contact-primary-phone"]').type('3232323232');
  cy.get('[data-testid="is-spouse-deceased-0"]').click();
  cy.get('[data-testid="contact-secondary-name"]').type('John Spouse');
  cy.get('[data-testid="contactSecondary-in-care-of"]').type('John Doe');
  if (addPhone) {
    cy.get('[data-testid="contact-secondary-phone"]').type('1232323232');
  }
  cy.get('[data-testid="contactSecondary-placeOfLegalResidence"]').select('AK');
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

  cy.get('[data-testid="step-1-next-button"]').click();
}

export function fillIrsNoticeInformation(
  filePath: string,
  caseType: string = 'Deficiency',
  hasIrsNotice: boolean = true,
) {
  if (!hasIrsNotice) {
    cy.get('[data-testid="irs-notice-No"]').click();
    cy.get('[data-testid="case-type-select"]').select(caseType);
    cy.get('[data-testid="step-3-next-button"]').click();
    return;
  }
  cy.get('[data-testid="irs-notice-Yes"]').click();
  attachFile({
    filePath,
    selector: '[data-testid="irs-notice-upload-0"]',
    selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
  });
  cy.get('[data-testid="case-type-select"]').select(caseType);
  cy.get('[data-testid="irs-notice-tax-year-0"]').type('2024');
  cy.get('[data-testid="city-and-state-issuing-office-0"]').type('Jackson, NJ');
  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="step-3-next-button"]').click();
}

export function fillIrsNotice(index: number, filePath: string) {
  attachFile({
    filePath,
    selector: `[data-testid="irs-notice-upload-${index}"]`,
    selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
  });
  cy.get('[data-testid="case-type-select"]').eq(index).select('Deficiency');
  cy.get(`[data-testid="irs-notice-tax-year-${index}"]`).type(
    `Tax Year ${index}`,
  );
  cy.get(`input[data-testid="notice-issued-date-${index}-picker"]`)
    .eq(1)
    .type('05/02/2024');
}

export function fillMultipleIRSNotices(filePath: string) {
  cy.get('[data-testid="irs-notice-Yes"]').click();

  // IRS Notice #1
  attachFile({
    filePath,
    selector: '[data-testid="irs-notice-upload-0"]',
    selectorToAwaitOnSuccess:
      '[data-testid^="upload-file-success"][data-testid*="0"]',
  });
  cy.get('[data-testid="case-type-select"]').select('Deficiency');
  cy.get(
    '.usa-date-picker__wrapper > [data-testid="notice-issued-date-0-picker"]',
  ).type('05/02/2024');
  cy.get('[data-testid="irs-notice-tax-year-0"]').type('2024');
  cy.get('[data-testid="city-and-state-issuing-office-0"]').type('Jackson, NJ');

  cy.get('[data-testid="add-another-irs-notice-button"]').click();

  // IRS Notice #2
  attachFile({
    filePath,
    selector: '[data-testid="irs-notice-upload-1"]',
    selectorToAwaitOnSuccess:
      '[data-testid^="upload-file-success"][data-testid*="1"]',
  });
  cy.get('[data-testid="case-type-select"]').eq(1).select('CDP (Lien/Levy)');
  cy.get(
    '.usa-date-picker__wrapper > [data-testid="notice-issued-date-1-picker"]',
  ).type('05/02/2023');
  cy.get('[data-testid="irs-notice-tax-year-1"]').type('2023');
  cy.get('[data-testid="city-and-state-issuing-office-1"]').type(
    'New York, NY',
  );

  cy.get('[data-testid="redaction-acknowledgement-label"]').click();
  cy.get('[data-testid="step-3-next-button"]').click();
}

export function fillCaseProcedureInformation(
  procedureType: ProcedureType = 'Regular',
) {
  cy.get(`[data-testid="procedure-type-${procedureType}-radio"]`).click();
  cy.get('[data-testid="preferred-trial-city"]').select('Birmingham, Alabama');
  cy.get('[data-testid="step-4-next-button"]').click();
}

export function fillStinInformation(filePath: string) {
  attachFile({
    filePath,
    selector: '[data-testid="stin-file"]',
    selectorToAwaitOnSuccess: '[data-testid^="upload-file-success"]',
  });
  cy.get('[data-testid="step-5-next-button"]').click();
}

export const contactInfo = {
  address1: '111 South West St.',
  city: 'Orlando',
  country: 'Country Name',
  email: 'petitioner1@example.com',
  internationalPostalCode: '12345-AB',
  internationalState: 'Province',
  name: 'John',
  phone: '3232323232',
  placeOfLegalResidence: 'DE',
  placeOfLegalResidenceLabel: 'Delaware',
  postalCode: '33233',
  state: 'AK',
};

export const secondaryContactInfo = {
  address1: '222 North East blv.',
  city: 'Boulder',
  country: 'Another Country Name',
  email: 'petitioner2@example.com',
  inCareOf: 'Spouse Care of',
  internationalPostalCode: '54321-CD',
  internationalState: 'Province',
  name: 'Bill',
  phone: '7878787878',
  placeOfLegalResidence: 'NJ',
  placeOfLegalResidenceLabel: 'New Jersey',
  postalCode: '88788',
  state: 'CO',
};

export const businessAndOtherContactInfo = {
  inCareOf: 'Test in care of',
  name: 'Test name',
  secondaryName: 'Test secondary name',
  title: 'Test title',
};

export function fillPrimaryContact() {
  cy.get('[data-testid="contact-primary-name"]').type(contactInfo.name);
  cy.get('[data-testid="contactPrimary.address1"]').type(contactInfo.address1);
  cy.get('[data-testid="contactPrimary.city"]').type(contactInfo.city);
  cy.get('[data-testid="contactPrimary.state"]').select(contactInfo.state);
  cy.get('[data-testid="contactPrimary.postalCode"]').type(
    contactInfo.postalCode,
  );
  cy.get('[data-testid="contactPrimary-placeOfLegalResidence"]').select(
    contactInfo.placeOfLegalResidence,
  );
  cy.get('[data-testid="contact-primary-phone"]').type(contactInfo.phone);
}

export function fillPrimaryContactInternational() {
  cy.get('[data-testid="international-country-btn"]').click();
  cy.get('[data-testid="international-country-input"]').type(
    contactInfo.country,
  );
  cy.get('[data-testid="contactPrimary.address1"]').type(contactInfo.address1);
  cy.get('[data-testid="contactPrimary.state"]').type(
    contactInfo.internationalState,
  );
  cy.get('[data-testid="contactPrimary.city"]').type(contactInfo.city);
  cy.get('[data-testid="contactPrimary.postalCode"]').type(
    contactInfo.internationalPostalCode,
  );
}

export function fillSecondaryContactInternational() {
  cy.get('[data-testid="use-same-address-above-label"]').click();

  cy.get('[data-testid="international-country-btn"]').eq(1).click();
  cy.get('[data-testid="international-country-input"]').type(
    secondaryContactInfo.country,
  );
  cy.get('[data-testid="contactSecondary.address1"]').type(
    secondaryContactInfo.address1,
  );
  cy.get('[data-testid="contactSecondary.state"]').type(
    secondaryContactInfo.internationalState,
  );
  cy.get('[data-testid="contactSecondary.city"]').type(
    secondaryContactInfo.city,
  );
  cy.get('[data-testid="contactSecondary.postalCode"]').type(
    secondaryContactInfo.internationalPostalCode,
  );
}

export function fillSecondaryContact(useSameAddress = true) {
  if (!useSameAddress) {
    cy.get('[data-testid="use-same-address-above-label"]').click();
    cy.get('[data-testid="contactSecondary.address1"]').type(
      secondaryContactInfo.address1,
    );
    cy.get('[data-testid="contactSecondary.city"]').type(
      secondaryContactInfo.city,
    );
    cy.get('[data-testid="contactSecondary.state"]').select(
      secondaryContactInfo.state,
    );

    cy.get('[data-testid="contactSecondary.postalCode"]').type(
      secondaryContactInfo.postalCode,
    );
  }
  cy.get('[data-testid="contactSecondary-placeOfLegalResidence"]').select(
    secondaryContactInfo.placeOfLegalResidence,
  );

  cy.get('[data-testid="contact-secondary-email"]').type(
    secondaryContactInfo.email,
  );

  cy.get(
    '[data-testid="register-email-address-provided-above-for-electronic-filing-and-service-label"]',
  ).click();

  cy.get('[data-testid="contact-secondary-phone"]').type(
    secondaryContactInfo.phone,
  );
}

export function fillBusinessandOtherContact({
  fillInCareOf = false,
  fillSecondaryName = false,
  fillTitle = false,
}: {
  fillInCareOf?: boolean;
  fillSecondaryName?: boolean;
  fillTitle?: boolean;
}) {
  cy.get('[data-testid="contact-primary-name"]').type(
    businessAndOtherContactInfo.name,
  );
  if (fillSecondaryName) {
    cy.get('[data-testid="contact-primary-secondary-name"]').type(
      businessAndOtherContactInfo.secondaryName,
    );
  }
  if (fillTitle) {
    cy.get('[data-testid="contact-primary-title"]').type(
      businessAndOtherContactInfo.title,
    );
  }
  if (fillInCareOf) {
    cy.get('[data-testid="contactPrimary-in-care-of"]').type(
      businessAndOtherContactInfo.inCareOf,
    );
  }
  cy.get('[data-testid="contactPrimary.address1"]').type(contactInfo.address1);
  cy.get('[data-testid="contactPrimary.city"]').type(contactInfo.city);
  cy.get('[data-testid="contactPrimary.state"]').select(contactInfo.state);
  cy.get('[data-testid="contactPrimary.postalCode"]').type(
    contactInfo.postalCode,
  );
}
