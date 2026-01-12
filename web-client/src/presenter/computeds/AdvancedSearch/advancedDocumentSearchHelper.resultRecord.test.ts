import { ADVANCED_SEARCH_TABS } from '../../../../../shared/src/business/entities/EntityConstants';
import { formatDocumentSearchResultRecord } from './advancedDocumentSearchHelper';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';

describe('formatDocumentSearchResultRecord', () => {
  const {
    BENCH_OPINION_EVENT_CODE,
    GENERIC_ORDER_EVENT_CODE,
    OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  } = applicationContext.getConstants();

  it('sets formattedJudgeName to empty string when the search result is an opinion that does not have a judge', () => {
    const mockResult = {
      eventCode: OPINION_EVENT_CODES_WITH_BENCH_OPINION[0],
    };

    const result = formatDocumentSearchResultRecord(mockResult, '', {
      applicationContext,
    });

    expect(result.formattedJudgeName).toEqual('');
  });

  it('sets formattedJudgeName to the judge last name when the search result is an opinion that has a judge', () => {
    const mockJudgeName = 'Michael G. Scott';
    const mockResult = {
      eventCode: OPINION_EVENT_CODES_WITH_BENCH_OPINION[0],
      judge: mockJudgeName,
    };

    const result = formatDocumentSearchResultRecord(mockResult, '', {
      applicationContext,
    });

    expect(result.formattedJudgeName).toEqual('Scott');
  });

  it('sets formattedJudgeName to signedJudgeName when the search result is a bench opinion', () => {
    const mockJudgeName = 'Michael G. Scott';
    const mockResult = {
      eventCode: BENCH_OPINION_EVENT_CODE,
      signedJudgeName: mockJudgeName,
    };

    const result = formatDocumentSearchResultRecord(mockResult, '', {
      applicationContext,
    });

    expect(result.formattedJudgeName).toEqual('Scott');
  });

  it('sets formattedJudgeName to an empty string when the search result is an order that does NOT have a signedJudgeName', () => {
    const mockResult = {
      eventCode: GENERIC_ORDER_EVENT_CODE,
      signedJudgeName: undefined,
    };

    const result = formatDocumentSearchResultRecord(mockResult, '', {
      applicationContext,
    });

    expect(result.formattedJudgeName).toEqual('');
  });

  it('sets formattedJudgeName to the judge last name when the search result is an order that has a signedJudgeName', () => {
    const mockJudgeName = 'Michael G. Scott';
    const mockResult = {
      eventCode: GENERIC_ORDER_EVENT_CODE,
      signedJudgeName: mockJudgeName,
    };

    const result = formatDocumentSearchResultRecord(mockResult, '', {
      applicationContext,
    });

    expect(result.formattedJudgeName).toEqual('Scott');
  });

  it('sets formattedJudgeName to the judge field when the eventCode is SPOS', () => {
    const mockJudgeName = 'Scott';
    const mockResult = {
      eventCode: 'SPOS',
      judge: mockJudgeName,
    };

    const result = formatDocumentSearchResultRecord(mockResult, '', {
      applicationContext,
    });

    expect(result.formattedJudgeName).toEqual(mockJudgeName);
  });

  it('sets formattedJudgeName to the judge field when the eventCode is SPTO', () => {
    const mockJudgeName = 'Scott';
    const mockResult = {
      eventCode: 'SPTO',
      judge: mockJudgeName,
    };

    const result = formatDocumentSearchResultRecord(mockResult, '', {
      applicationContext,
    });

    expect(result.formattedJudgeName).toEqual(mockJudgeName);
  });

  it('sets numberOfPagesFormatted to n/a if numberOfPages is undefined', () => {
    const result = formatDocumentSearchResultRecord(
      {
        numberOfPages: undefined,
      },
      '',
      {
        applicationContext,
      },
    );
    expect(result.numberOfPagesFormatted).toEqual('n/a');
  });

  it('sets numberOfPagesFormatted to 0 if numberOfPages is 0', () => {
    const result = formatDocumentSearchResultRecord(
      {
        numberOfPages: 0,
      },
      '',
      {
        applicationContext,
      },
    );

    expect(result.numberOfPagesFormatted).toEqual(0);
  });

  it('should show the seal icon if the case is sealed', () => {
    const result = formatDocumentSearchResultRecord(
      {
        isCaseSealed: true,
      },
      ADVANCED_SEARCH_TABS.ORDER,
      {
        applicationContext,
      },
    );

    expect(result.showSealedIcon).toBe(true);
  });
});
