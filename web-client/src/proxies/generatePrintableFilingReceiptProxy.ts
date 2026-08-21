import { post } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const generatePrintableFilingReceiptInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, documentsFiled, fileAcrossConsolidatedGroup },
): Promise<string> => {
  return post({
    applicationContext,
    body: {
      docketNumber,
      documentsFiled,
      fileAcrossConsolidatedGroup,
    },
    endpoint: '/documents/filing-receipt-pdf',
  });
};
