import {
  ENTERED_AND_SERVED_EVENT_CODES,
  GENERIC_ORDER_DOCUMENT_TYPE,
} from '../entities/courtIssuedDocument/CourtIssuedDocumentConstants';

export const stampDocumentForService = async ({
  applicationContext,
  documentToStamp,
  pdfData,
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

  return await applicationContext.getUseCaseHelpers().addServedStampToDocument({
    applicationContext,
    pdfData,
    serviceStampText: `${serviceStampType} ${serviceStampDate}`,
  });
};
