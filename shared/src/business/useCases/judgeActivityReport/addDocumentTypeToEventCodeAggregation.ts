import { COURT_ISSUED_EVENT_CODES } from '../../entities/EntityConstants';

interface AggregatedEventCode {
  eventCode: string;
  count: number;
}

interface AggregatedEventCodeWithDocumentType extends AggregatedEventCode {
  documentType: string;
}

export const addDocumentTypeToEventCodeAggregation = (
  aggregations?: AggregatedEventCode[],
): AggregatedEventCodeWithDocumentType[] => {
  if (!aggregations) return [];

  return aggregations.map(eventCodeObj => {
    return {
      ...eventCodeObj,
      documentType: COURT_ISSUED_EVENT_CODES.find(
        event => event.eventCode === eventCodeObj.eventCode,
      )!.documentType,
    };
  });
};
