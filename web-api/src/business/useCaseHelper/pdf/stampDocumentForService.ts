import {
  ENTERED_AND_SERVED_EVENT_CODES,
  GENERIC_ORDER_DOCUMENT_TYPE,
} from '../../../../../shared/src/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const stampDocumentForService = async ({
  applicationContext,
  docketEntryId,
  documentToStamp,
}: {
  applicationContext: ServerApplicationContext;
  docketEntryId: string;
  documentToStamp: {
    documentType: string;
    eventCode: string;
    serviceStamp: string;
  };
}) => {
  let serviceStampType = 'Served';

  if (documentToStamp.documentType === GENERIC_ORDER_DOCUMENT_TYPE) {
    serviceStampType = documentToStamp.serviceStamp;
  } else if (
    ENTERED_AND_SERVED_EVENT_CODES.includes(documentToStamp.eventCode)
  ) {
    serviceStampType = 'Entered and Served';
  }

  const servedAt = applicationContext.getUtilities().createISODateString();
  const serviceStampDate = applicationContext
    .getUtilities()
    .formatDateString(servedAt, 'MMDDYY');

  const pdfData = await applicationContext.getPersistenceGateway().getDocument({
    applicationContext,
    key: docketEntryId,
  });

  return await applicationContext.getUseCaseHelpers().addServedStampToDocument({
    applicationContext,
    pdfData,
    serviceStampText: `${serviceStampType} ${serviceStampDate}`,
  });
};
