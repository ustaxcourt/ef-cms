import { Document } from '../../../../shared/src/business/entities/Document';
const courtIssuedEventCodes = require('../../../../shared/src/tools/courtIssuedEventCodes.json');

/**
 * get the opinion document types
 *
 * @param {object} providers the providers object
 * @returns {object} the list of opinion document types
 */
export const getOpinionTypesAction = () => {
  const opinionDocuments = courtIssuedEventCodes.filter(courtIssuedDocument => {
    if (
      Document.OPINION_DOCUMENT_TYPES.includes(courtIssuedDocument.eventCode)
    ) {
      return courtIssuedDocument;
    }
  });

  const opinionDocumentTypes = opinionDocuments.map(opinionDocument =>
    opinionDocument.documentType.split('-').pop().trim(),
  );

  return { opinionDocumentTypes };
};
