import {
  DATE_RANGE_SEARCH_OPTIONS,
  MAX_DOCUMENT_SEARCH_RESULTS,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { opinionPublicSearchInteractor } from './opinionPublicSearchInteractor';

describe('opinionPublicSearchInteractor', () => {
  const mockOpinionSearchResult = [
    {
      caseCaption: 'Reuben Blair, Petitioner',
      docketEntryId: '6945cdff-fd12-422b-bf2c-63b792b7f618',
      docketNumber: '103-20',
      docketNumberWithSuffix: undefined,
      documentTitle: 'Memorandum Opinion Judge Colvin',
      documentType: undefined,
      eventCode: undefined,
      filingDate: '2020-05-12T18:42:10.471Z',
      isSealed: false,
      isStricken: undefined,
      judge: undefined,
      numberOfPages: 1,
      sealedDate: undefined,
      signedJudgeName: 'Maurice B. Foley',
      entityName: 'PublicDocumentSearchResult',
    },
  ];

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue({
        results: mockOpinionSearchResult,
        totalCount: mockOpinionSearchResult.length,
      });
  });

  it('should restrict search to opinion event codes (allow sealed case opinions)', async () => {
    await opinionPublicSearchInteractor(applicationContext, {
      dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
      keyword: 'fish',
      opinionTypes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
      startDate: '01/01/2001',
    } as any);
    const searchArgs =
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0];
    expect(searchArgs.documentEventCodes).toMatchObject(
      OPINION_EVENT_CODES_WITH_BENCH_OPINION,
    );
    expect(searchArgs.omitSealed).toBeUndefined();
  });

  it('should cap at 5000 results when over limit', async () => {
    const overLimit = new Array(MAX_DOCUMENT_SEARCH_RESULTS + 1).fill({
      caseCaption: 'Samson Workman, Petitioner',
      docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
      docketNumber: '103-19',
      documentTitle: 'T.C. Opinion for More Candy',
      documentType: 'T.C. Opinion',
      eventCode: 'TCOP',
      signedJudgeName: 'Roslindis Angelino',
    });
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue({
        results: overLimit,
      });
    const results = await opinionPublicSearchInteractor(applicationContext, {
      dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
      keyword: 'fish',
      startDate: '01/01/2001',
    } as any);
    expect(results.results.length).toBe(5000);
  });

  it('should return results matching keyword', async () => {
    const result = await opinionPublicSearchInteractor(applicationContext, {
      dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
      keyword: 'memorandum',
      startDate: '01/01/2001',
    } as any);

    expect(result.results).toEqual(mockOpinionSearchResult);
  });

  it('should not filter out sealed case opinions', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue({ sealedDate: 'some date' });

    const results = await opinionPublicSearchInteractor(applicationContext, {
      dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
      keyword: 'fish',
      startDate: '01/01/2001',
    } as any);

    expect(results.results.length).toBe(1);
  });

  it('should set isOpinionSearch true', async () => {
    await opinionPublicSearchInteractor(applicationContext, {} as any);

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      isOpinionSearch: true,
    });
  });

  it('should batch internally to top off results', async () => {
    const makeBatch = (count: number, startIndex: number) =>
      Array.from({ length: count }).map((_, i) => ({
        caseCaption: 'Caption',
        docketEntryId: `00000000-0000-4000-8000-${String(startIndex + i).padStart(12, '0')}`,
        docketNumber: '123-45',
        documentTitle: 'Some Opinion',
        documentType: 'T.C. Opinion',
        eventCode: 'TCOP',
        signedJudgeName: 'Judge',
        sort: [startIndex + i],
      }));

    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockReset()
      .mockResolvedValueOnce({ results: makeBatch(1500, 0) })
      .mockResolvedValueOnce({ results: makeBatch(1500, 1500) })
      .mockResolvedValueOnce({ results: makeBatch(1500, 3000) })
      .mockResolvedValueOnce({ results: makeBatch(501, 4500) });

    const result = await opinionPublicSearchInteractor(applicationContext, {
      keyword: 'x',
    } as any);

    expect(result.results).toHaveLength(5000);
    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls.length,
    ).toBeGreaterThan(1);
  });

  it('should return empty results when no matches', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockReset()
      .mockResolvedValueOnce({ results: [] });
    const result = await opinionPublicSearchInteractor(applicationContext, {
      keyword: 'none',
    } as any);
    expect(result.results).toHaveLength(0);
  });

  it('should throw when a result fails validation', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockReset()
      .mockResolvedValueOnce({
        results: [
          {
            caseCaption: 'Broken Public Opinion',
            docketEntryId: '00000000-0000-4000-8000-000000000299',
            docketNumber: '111-11',
            documentTitle: 'Bad Public Opinion',
            documentType: 'T.C. Opinion',
            eventCode: 'TCOP',
            signedJudgeName: 'Judge',
            numberOfPages: 'yellow',
          },
        ],
      });
    await expect(
      opinionPublicSearchInteractor(applicationContext, {
        keyword: 'bad',
      } as any),
    ).rejects.toThrow('entity was invalid');
  });
});
