import { OPINION_EVENT_CODES } from '../../../../shared/src/business/entities/EntityConstants';
const courtIssuedEventCodes = require('../../../../shared/src/tools/courtIssuedEventCodes.json');

/**
 * get the opinion document types
 *
 * @param {object} providers the providers object
 * @returns {object} the list of opinion document types
 */
export const getOpinionTypesAction = () => {
  const opinionDocuments = courtIssuedEventCodes.filter(courtIssuedDocument => {
    if (OPINION_EVENT_CODES.includes(courtIssuedDocument.eventCode)) {
      return courtIssuedDocument;
    }
  });

  const opinionDocumentTypes = opinionDocuments.map(opinionDocument =>
    opinionDocument.documentType.split('-').pop().trim(),
  );

  return { opinionDocumentTypes };
};
