import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const createCourtIssuedOrderPdfFromHtmlInteractor = (
  applicationContext: ClientApplicationContext,
  {
    addedDocketNumbers,
    contentHtml,
    docketNumber,
    documentTitle,
    eventCode,
  }: {
    addedDocketNumbers: string[];
    contentHtml: string;
    docketNumber: string;
    documentTitle: string;
    eventCode: string;
  },
) => {
  return post({
    applicationContext,
    body: {
      addedDocketNumbers,
      contentHtml,
      docketNumber,
      documentTitle,
      eventCode,
    },
    endpoint: '/api/court-issued-order',
  });
};
