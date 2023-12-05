import { OPINION_EVENT_CODES_WITH_BENCH_OPINION } from '../../../../shared/src/business/entities/EntityConstants';
import courtIssuedEventCodes from '../../../../shared/src/tools/courtIssuedEventCodes.json';

/**
 * get the opinion document types
 *
 * @param {object} providers the providers object
 * @returns {object} the list of opinion document types
 */
export const getOpinionTypesAction = () => {
  const opinionDocuments = courtIssuedEventCodes.filter(courtIssuedDocument => {
    if (
      OPINION_EVENT_CODES_WITH_BENCH_OPINION.includes(
        courtIssuedDocument.eventCode,
      )
    ) {
      return courtIssuedDocument;
    }
  });

  const opinionDocumentTypes = opinionDocuments.map(opinionDocument =>
    opinionDocument.documentType.split('-').pop().trim(),
  );

  return { opinionDocumentTypes };
};
