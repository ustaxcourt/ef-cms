import { ProcedureType } from '../../../shared/src/business/entities/EntityConstants';
import { attachFile } from '../file/upload-file';
import { loginAsPetitionsClerk1 } from '../authentication/login-as-helpers';

export function createAndServePaperPetition(
  {
    procedureType = 'Regular',
    trialLocation = 'Birmingham, Alabama',
    yearReceived = '2020',
  }: Partial<{
    yearReceived: string;
    procedureType: ProcedureType;
    trialLocation: string;
  }> = {
    procedureType: 'Regular',
    trialLocation: 'Birmingham, Alabama',
    yearReceived: '2020',
  },
): Cypress.Chainable<{
  docketNumber: string;
  documentsCreated: {
    eventCode: string;
    index: number;
    servedTo: string;
  }[];
  name: string;
}> {
  const name = 'rick james ' + Date.now();
  loginAsPetitionsClerk1();
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
  cy.get('[data-testid="document-qc-nav-item"]').click();
  cy.get('[data-testid="start-a-petition"]').click();
  cy.get('#party-type').select('Petitioner');
  cy.get('[data-testid="contact-primary-name"]').clear();
  cy.get('[data-testid="contact-primary-name"]').type(name);
  cy.get('[data-testid="contactPrimary.address1"]').clear();
  cy.get('[data-testid="contactPrimary.address1"]').type('some random street');
  cy.get('[data-testid="contactPrimary.city"]').clear();
  cy.get('[data-testid="contactPrimary.city"]').type('cleveland');
  cy.get('[data-testid="contactPrimary.state"]').select('TN');
  cy.get('[data-testid="contactPrimary.postalCode"]').clear();
  cy.get('[data-testid="contactPrimary.postalCode"]').type('33333');
  cy.get('[data-testid="phone"]').clear();
  cy.get('[data-testid="phone"]').type('n/a');
  cy.get('#tab-case-info > .button-text').click();
  cy.get('#date-received-picker').clear();
  cy.get('#date-received-picker').type(`01/02/${yearReceived}`);
  cy.get('#mailing-date').clear();
  cy.get('#mailing-date').type('01/02/2019');
  cy.get(`[data-testid="procedure-type-${procedureType}-radio"]`).click();
  cy.get('[data-testid="preferred-trial-city"]').select(trialLocation);
  cy.get(
    ':nth-child(9) > .usa-fieldset > :nth-child(3) > .usa-radio__label',
  ).click();
  cy.get('#payment-status-unpaid').check({ force: true });
  cy.get(':nth-child(10) > .usa-checkbox__label').click();
  cy.get('#order-for-filing-fee').check({ force: true });
  cy.get('#order-to-show-cause').check({ force: true });
  cy.get('#order-for-requested-trial-location').check({ force: true });
  cy.get('#order-for-ratification').scrollIntoView();
  cy.get('#order-for-ratification').uncheck({ force: true });
  cy.get('#notice-of-attachments').check({ force: true });
  cy.get('#order-for-amended-petition').check({ force: true });

  cy.get('#tab-irs-notice > .button-text').click();
  cy.get('[data-testid="case-type-select"]').select('CDP (Lien/Levy)');
  cy.get('#upload-mode-upload').click();
  cy.get('#uploadMode').check();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: '#petitionFile-file',
    selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
  });
  cy.get('#tabButton-requestForPlaceOfTrialFile > .button-text').click();
  cy.get('#scan-mode-radios').click();
  cy.get('#upload-mode-upload').click();
  cy.get('#uploadMode').check();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: '#requestForPlaceOfTrialFile-file',
    selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
  });

  cy.get('[data-testid="tabButton-stinFile"]').click();
  cy.get('[data-testid="upload-pdf-button"]').click();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: 'input#stinFile-file',
    selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
  });

  cy.get('[data-testid="tabButton-attachmentToPetitionFile"]').click();
  cy.get('[data-testid="upload-pdf-button"]').click();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: 'input#attachmentToPetitionFile-file',
    selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
  });
  cy.get('[data-testid="remove-pdf"]');

  cy.get('[data-testid="tabButton-corporateDisclosureFile"]').click();
  cy.get('[data-testid="upload-pdf-button"]').click();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: 'input#corporateDisclosureFile-file',
    selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
  });

  cy.get(
    '[data-testid="tabButton-applicationForWaiverOfFilingFeeFile"]',
  ).click();
  cy.get('[data-testid="upload-pdf-button"]').click();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: 'input#applicationForWaiverOfFilingFeeFile-file',
    selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
  });

  cy.get('[data-testid="submit-paper-petition"]').click();
  return cy
    .get('.docket-number-header a')
    .invoke('attr', 'href')
    .then(href => {
      const docketNumber = href!.split('/').pop();
      cy.get('[data-testid="serve-case-to-irs"]').click();
      cy.get('[data-testid="modal-confirm"]').click();
      cy.get('#done-viewing-paper-petition-receipt-button').click();
      cy.get('.usa-alert__text').should('have.text', 'Petition served to IRS.');

      cy.get('[data-testid="docket-number-search-input"]').type(
        `${docketNumber}`,
      );
      cy.get('.usa-search-submit-text').click();

      cy.get('[data-testid="case-status"]').should(
        'have.text',
        'General Docket - Not at Issue',
      );

      const expectedDocuments = [
        { eventCode: 'P', index: 1, servedTo: 'R' },
        { eventCode: 'ATP', index: 2, servedTo: 'R' },
        { eventCode: 'APW', index: 3, servedTo: 'R' },
        { eventCode: 'DISC', index: 4, servedTo: 'R' },
        { eventCode: 'RQT', index: 5, servedTo: 'R' },
        { eventCode: 'NOTR', index: 6, servedTo: 'P' },
      ];

      expectedDocuments.forEach(({ eventCode, index, servedTo }) => {
        cy.get(`[data-testid="docket-entry-index-${index}-eventCode"]`).should(
          'have.text',
          eventCode,
        );
        cy.get(
          `[data-testid="docket-entry-index-${index}-servedPartiesCode"]`,
        ).should('have.text', servedTo);
      });

      cy.get('[data-testid="tab-drafts"] > .button-text').click();

      cy.get('[data-testid="docket-entry-description-0"]').should(
        'have.text',
        'Notice of Attachments in the Nature of Evidence',
      );
      cy.get('[data-testid="docket-entry-description-1"]').should(
        'have.text',
        'Order',
      );
      cy.get('[data-testid="docket-entry-description-2"]').should(
        'have.text',
        'Order',
      );
      cy.get('[data-testid="docket-entry-description-3"]').should(
        'have.text',
        'Order to Show Cause',
      );

      cy.get('[data-testid="tab-docket-record"]').click();

      return cy.wrap({
        docketNumber: docketNumber!,
        documentsCreated: expectedDocuments,
        name,
      });
    });
}

export function createAndServePaperPetitionMyselfAndSpouse() {
  cy.login('petitionsclerk1');
  cy.get('[data-testid="inbox-tab-content"]').should('exist');
  cy.get('[data-testid="document-qc-nav-item"]').click();
  cy.get('[data-testid="start-a-petition"]').click();

  cy.get('#party-type').select('Petitioner & spouse');
  cy.get('[data-testid="contact-primary-name"]').type('John');
  cy.get('[data-testid="contactPrimary.address1"]').type('111 South West St.');
  cy.get('[data-testid="contactPrimary.city"]').type('Orlando');
  cy.get('[data-testid="contactPrimary.state"]').select('AK');
  cy.get('[data-testid="contactPrimary.postalCode"]').type('09876');
  cy.get('[data-testid="phone"]').type('3232323232');
  cy.get('[data-testid="contact-secondary-name"]').type('John Spouse');
  cy.get('[data-testid="contactSecondary.address1"]').type('address1');
  cy.get('[data-testid="contactSecondary.city"]').type('jackson');
  cy.get('[data-testid="contactSecondary.state"]').select('AL');
  cy.get('[data-testid="contactSecondary.postalCode"]').type('09876');
  cy.get('[data-testid="tab-case-info"] > .button-text').click();

  cy.get('#date-received-picker').type('07/16/2024');
  cy.get('#mailing-date').type('07/16/2024');
  cy.get('[data-testid="preferred-trial-city"]').select('Birmingham, Alabama');
  cy.get('[data-testid="payment-status-paid-radio"]').click();

  cy.get('[data-testid="payment-date-picker"]').eq(1).type('07/16/2024');
  cy.get('#petition-payment-method').type('paid');
  cy.get('[data-testid="tab-irs-notice"] > .button-text').click();
  cy.get('[data-testid="case-type-select"]').select('Deficiency');

  cy.get('#upload-mode-upload').click();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: '#petitionFile-file',
    selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
  });

  cy.get('#tabButton-requestForPlaceOfTrialFile > .button-text').click();
  cy.get('#upload-mode-upload').click();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: '#requestForPlaceOfTrialFile-file',
    selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
  });

  cy.get('[data-testid="tabButton-stinFile"]').click();
  cy.get('[data-testid="upload-pdf-button"]').click();
  attachFile({
    filePath: '../../helpers/file/sample.pdf',
    selector: 'input#stinFile-file',
    selectorToAwaitOnSuccess: '[data-testid="remove-pdf"]',
  });

  cy.get('[data-testid="submit-paper-petition"]').click();

  return cy
    .get('.docket-number-header a')
    .invoke('attr', 'href')
    .then(href => {
      const docketNumber = href!.split('/').pop();
      cy.get('[data-testid="serve-case-to-irs"]').click();
      cy.get('[data-testid="modal-confirm"]').click();
      cy.get(
        '[data-testid="done-viewing-paper-petition-receipt-button"]',
      ).click();

      cy.get('[data-testid="success-alert"]').contains(
        'Petition served to IRS.',
      );

      cy.get('[data-testid="docket-number-search-input"]').type(
        `${docketNumber}`,
      );

      cy.get('[data-testid="search-docket-number"]').click();

      return cy.wrap(docketNumber);
    });
}
