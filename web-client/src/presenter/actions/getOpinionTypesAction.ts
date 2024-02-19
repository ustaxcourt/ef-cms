import { DocketEntry } from '@shared/business/entities/DocketEntry';
import courtIssuedEventCodes from '@shared/tools/courtIssuedEventCodes.json';

/**
 * get the opinion document types
 *
 * @param {object} providers the providers object
 * @returns {object} the list of opinion document types
 */
export const getOpinionTypesAction = () => {
  const opinionDocuments = courtIssuedEventCodes.filter(courtIssuedDocument =>
    DocketEntry.isOpinion(courtIssuedDocument.eventCode),
  );

  const opinionDocumentTypes = opinionDocuments.map(opinionDocument =>
    opinionDocument.documentType.split('-').pop().trim(),
  );

  return { opinionDocumentTypes };
};
