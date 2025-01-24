import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { COURT_ISSUED_EVENTS } from '@shared/business/entities/docketEntry/courtIssuedEventCodes';

/**
 * get the opinion document types
 *
 * @param {object} providers the providers object
 * @returns {object} the list of opinion document types
 */
export const getOpinionTypesAction = () => {
  const opinionDocuments = COURT_ISSUED_EVENTS.filter(courtIssuedDocument =>
    DocketEntry.isOpinion(courtIssuedDocument.eventCode),
  );

  const opinionDocumentTypes = opinionDocuments.map(opinionDocument =>
    opinionDocument.documentType.split('-').pop().trim(),
  );

  return { opinionDocumentTypes };
};
