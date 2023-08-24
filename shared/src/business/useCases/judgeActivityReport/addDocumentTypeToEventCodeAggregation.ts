import { COURT_ISSUED_EVENT_CODES } from '../../entities/EntityConstants';

export const addDocumentTypeToEventCodeAggregation = aggregations =>
  aggregations.map(eventCodeObj => {
    return {
      ...eventCodeObj,
      documentType: COURT_ISSUED_EVENT_CODES.find(
        event => event.eventCode === eventCodeObj.eventCode,
      )!.documentType,
    };
  });
