import { PROCEDURE_TYPES_MAP } from '../../../../shared/src/business/entities/EntityConstants';
import { attachFile } from '../../../helpers/file/upload-file';
import { faker } from '@faker-js/faker';
import {
  getCreateACaseButton,
  navigateTo as navigateToDocumentQC,
} from './document-qc';

export const createPaperPetition = () => {
  navigateToDocumentQC('petitionsclerk');

  getCreateACaseButton().click();
  cy.get('#tab-parties').should('have.attr', 'aria-selected');

  fillInCreateCaseFromPaperForm();
  return postPaperPetition();
};

export const postPaperPetition = () => {
  cy.intercept('POST', '**/paper').as('postPaperCase');
  cy.get('#submit-case').click();

  return cy.wait('@postPaperCase').then(({ response }) => {
    if (!response || !response.body?.docketNumber) {
      throw new Error(
        'Unable to get docket number from postPaperCase HTTP request',
      );
    }
    expect(response.body).to.have.property('docketNumber');
    return cy.wrap({ docketNumber: response.body.docketNumber! });
  });
};

export const fillInCreateCaseFromPaperForm = (testData?: {
  testPetitionerName: string;
}) => {
  const petitionerName = `${faker.person.firstName()} ${faker.person.lastName()}`;
  cy.get('#party-type').select('Petitioner');
  cy.get('#name').type(petitionerName);
  if (testData) {
    testData.testPetitionerName = petitionerName;
  }
  cy.get('input[name="contactPrimary.address1"]').type(
    faker.location.streetAddress(),
  );
  cy.get('input[name="contactPrimary.city"]').type(faker.location.city());
  cy.get('select[name="contactPrimary.state"]').select(
    faker.location.state({ abbreviated: true }),
  );
  cy.get('input[name="contactPrimary.postalCode"]').type(
    faker.location.zipCode(),
  );
  cy.get('input[name="contactPrimary.phone"]').type(faker.phone.number());

  cy.get('#tab-case-info').click();

  cy.get('input#date-received-picker').type('01/01/2020');
  cy.get('#mailing-date').type('01/01/2020');
  cy.get(
    `[data-testid="procedure-type-${PROCEDURE_TYPES_MAP.regular}-radio"]`,
  ).click();
  cy.get('#preferred-trial-city').scrollIntoView();
  cy.get('#preferred-trial-city').select('Birmingham, Alabama');
  cy.get('label[for="payment-status-paid"]').click();
  cy.get('#payment-date-picker').type('01/01/2020');
  cy.get('#petition-payment-method').type('Tears of my enemies');

  cy.get('label[for="notice-of-attachments"]').scrollIntoView();
  cy.get('label[for="notice-of-attachments"]').click();
  cy.get('label[for="order-for-ratification"]').scrollIntoView();
  cy.get('label[for="order-for-ratification"]').click();

  cy.get('#tab-irs-notice').click();
  cy.get('#case-type').scrollIntoView();
  cy.get('#case-type').select('Deficiency');
  cy.get('#has-irs-verified-notice-yes').click();
  cy.get('#year-0').type('1995');

  const deficiencyAmount = '120,035';
  const deficiencyAmountWithoutComma = deficiencyAmount.replace(',', '');
  cy.get('[data-testid="deficiency-amount-0"]').type(
    deficiencyAmountWithoutComma,
  );
  cy.get('[data-testid="deficiency-amount-0"]').should(
    'have.value',
    `$${deficiencyAmount}.00`,
  );

  cy.get('button.calculate-penalties').click();
  cy.get('#penalty_0').type('0');
  cy.get('button#modal-button-confirm').click();

  // petition
  cy.get('[data-testid="upload-pdf-button"]').click();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: 'input#petitionFile-file',
    selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
  });
  cy.get('[data-testid="remove-pdf"]');

  //stin
  cy.get('[data-testid="tabButton-stinFile"]').click();
  cy.get('[data-testid="upload-pdf-button"]').click();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: 'input#stinFile-file',
    selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
  });
  cy.get('[data-testid="remove-pdf"]');

  // rqt
  cy.get('[data-testid="tabButton-requestForPlaceOfTrialFile"]').click();
  cy.get('[data-testid="upload-pdf-button"]').click();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: 'input#requestForPlaceOfTrialFile-file',
    selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
  });
  cy.get('[data-testid="remove-pdf"]');
  cy.get('[data-testid="icon-requestForPlaceOfTrialFile"]').should(
    'be.visible',
  );

  // atp
  cy.get('[data-testid="tabButton-attachmentToPetitionFile"]').click();
  cy.get('[data-testid="upload-pdf-button"]').click();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: 'input#attachmentToPetitionFile-file',
    selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
  });

  cy.get('[data-testid="remove-pdf"]');
};
