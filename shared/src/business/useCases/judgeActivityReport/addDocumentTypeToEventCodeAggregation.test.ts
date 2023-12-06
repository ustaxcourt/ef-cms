import { COURT_ISSUED_EVENT_CODES } from '../../entities/EntityConstants';
import { addDocumentTypeToEventCodeAggregation } from './addDocumentTypeToEventCodeAggregation';

describe('addDocumentTypeToEventCodeAggregation', () => {
  it('adds document types to an array of aggregated event codes', () => {
    const aggsArray = [
      {
        count: 1,
        eventCode: 'O',
      },
    ];
    const results = addDocumentTypeToEventCodeAggregation(aggsArray);
    expect(results).toEqual([
      {
        count: 1,
        documentType: COURT_ISSUED_EVENT_CODES.find(
          event => event.eventCode === 'O',
        )!.documentType,
        eventCode: 'O',
      },
    ]);
  });

  it('returns an empty array if aggregations is undefined', () => {
    const results = addDocumentTypeToEventCodeAggregation();
    expect(results).toEqual([]);
  });

  it('returns an empty array if aggregations is an empty array', () => {
    const results = addDocumentTypeToEventCodeAggregation([]);
    expect(results).toEqual([]);
  });
});
