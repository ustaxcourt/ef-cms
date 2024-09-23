import {
  FORMATS,
  formatNow,
} from '../../../shared/src/business/utilities/DateHandler';

export const docketNumber = '107-19';
export const leadCaseDocketNumber = '102-67';
export const statusReportDocketEntryId = '178af2d2-fab1-445a-a729-d3da63517a0a';
export const messages = {
  statusReport: {
    messageId: '73d4365b-8b3a-4b01-9ca3-7087f7a6d4b5',
    name: 'Status Report',
  },
  testStatusReportOrderSigned: {
    messageId: '32484c7f-4606-49fc-89f1-27ba1d5596be',
    name: 'Test Status Report Order (Signed)',
  },
  testStatusReportOrderUnsigned: {
    messageId: '34483b5b-29de-4ad4-8caa-59f71ad6d906',
    name: 'Test Status Report Order (Unsigned)',
  },
};
export const expectedPdfLines = [
  'On June 28, 2024, a status report was filed (Document no. 5). For cause, it is',
  `ORDERED that the parties shall file a further status report by ${formatNow(FORMATS.MONTH_DAY_YEAR)}. It is further`,
  'ORDERED that this case is stricken from the trial session. It is further',
  'ORDERED that jurisdiction is retained by the undersigned. It is further',
  'ORDERED that Here is my additional order text.',
];
export const selectAllOptionsInForm = () => {
  cy.get('#order-type-status-report').check({ force: true });
  cy.get('#status-report-due-date-picker').type(formatNow(FORMATS.MMDDYYYY));
  cy.get('#stricken-from-trial-sessions').check({ force: true });
  cy.get('#jurisdiction-retained').check({ force: true });
  cy.get('#additional-order-text').type('Here is my additional order text.');
};

export const getLastDraftOrderElementFromDrafts = () => {
  return cy.get('button:contains(Order)').last();
};

export const getLastDraftOrderElementIndexFromDrafts = () => {
  return getLastDraftOrderElementFromDrafts().then(lastOrderButton => {
    return lastOrderButton.index();
  });
};
