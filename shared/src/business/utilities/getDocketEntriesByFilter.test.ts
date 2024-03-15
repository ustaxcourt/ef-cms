import { DOCKET_RECORD_FILTER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getDocketEntriesByFilter } from './getDocketEntriesByFilter';

describe('getDocketEntriesByFilter', () => {
  const ORDER_DOCKET_ENTRY = {
    eventCode: 'O',
    isDraft: false,
  };

  const MOTION_DOCKET_ENTRY = {
    eventCode: 'M006',
    isDraft: false,
  };

  const EXHIBITS_EVENT_CODE = {
    eventCode: 'STIP',
    isDraft: false,
  };

  const mockDocketEntries = [
    ORDER_DOCKET_ENTRY,
    MOTION_DOCKET_ENTRY,
    EXHIBITS_EVENT_CODE,
  ];

  it('should return all the documents if the filter is neither motions, exhibits, nor orders', () => {
    const expectedResults = mockDocketEntries;

    const result = getDocketEntriesByFilter(applicationContext, {
      docketEntries: mockDocketEntries,
      docketRecordFilter: 'All documents',
    });
    expect(result).toEqual(expectedResults);
  });

  it('should return all the documents if the filter is "orders"', () => {
    const expectedResults = [ORDER_DOCKET_ENTRY];

    const result = getDocketEntriesByFilter(applicationContext, {
      docketEntries: mockDocketEntries,
      docketRecordFilter: DOCKET_RECORD_FILTER_OPTIONS.orders,
    });
    expect(result).toEqual(expectedResults);
  });

  it('should return all the documents if the filter is "motions"', () => {
    const expectedResults = [MOTION_DOCKET_ENTRY];

    const result = getDocketEntriesByFilter(applicationContext, {
      docketEntries: mockDocketEntries,
      docketRecordFilter: DOCKET_RECORD_FILTER_OPTIONS.motions,
    });
    expect(result).toEqual(expectedResults);
  });

  it('should return all the documents if the filter is "exhibits"', () => {
    const expectedResults = [EXHIBITS_EVENT_CODE];

    const result = getDocketEntriesByFilter(applicationContext, {
      docketEntries: mockDocketEntries,
      docketRecordFilter: DOCKET_RECORD_FILTER_OPTIONS.exhibits,
    });
    expect(result).toEqual(expectedResults);
  });
});
