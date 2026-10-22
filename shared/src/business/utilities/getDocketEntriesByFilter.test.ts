import {
  DOCKET_RECORD_FILTER_OPTIONS,
  EXHIBIT_EVENT_CODES,
  MOTION_EVENT_CODES,
  ORDER_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { getDocketEntriesByFilter } from './getDocketEntriesByFilter';

describe('getDocketEntriesByFilter', () => {
  const applicationContext = {
    getConstants: () => ({
      DOCKET_RECORD_FILTER_OPTIONS,
      EXHIBIT_EVENT_CODES,
      MOTION_EVENT_CODES,
      ORDER_EVENT_CODES,
    }),
  };

  const MOCK_DOCKET_ENTRY = MOCK_CASE.docketEntries[0];

  const ORDER_DOCKET_ENTRY = {
    ...MOCK_DOCKET_ENTRY,
    eventCode: 'O',
    isDraft: false,
  };

  const MOTION_DOCKET_ENTRY = {
    ...MOCK_DOCKET_ENTRY,
    eventCode: 'M006',
    isDraft: false,
  };

  const EXHIBIT_DOCKET_ENTRY = {
    ...MOCK_DOCKET_ENTRY,
    eventCode: 'STIP',
    isDraft: false,
  };

  const EXHIBIT_IN_SUPPORT_DOCKET_ENTRY = {
    ...MOCK_DOCKET_ENTRY,
    eventCode: 'EXS',
    isDraft: false,
  };

  const mockDocketEntries: RawDocketEntry[] = [
    ORDER_DOCKET_ENTRY,
    MOTION_DOCKET_ENTRY,
    EXHIBIT_DOCKET_ENTRY,
    EXHIBIT_IN_SUPPORT_DOCKET_ENTRY,
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
    const expectedResults = [
      EXHIBIT_DOCKET_ENTRY,
      EXHIBIT_IN_SUPPORT_DOCKET_ENTRY,
    ];

    const result = getDocketEntriesByFilter(applicationContext, {
      docketEntries: mockDocketEntries,
      docketRecordFilter: DOCKET_RECORD_FILTER_OPTIONS.exhibits,
    });
    expect(result).toEqual(expectedResults);
  });
});
