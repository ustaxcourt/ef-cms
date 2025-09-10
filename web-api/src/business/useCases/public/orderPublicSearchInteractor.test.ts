import {
  DATE_RANGE_SEARCH_OPTIONS,
  ORDER_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { orderPublicSearchInteractor } from './orderPublicSearchInteractor';

describe('orderPublicSearchInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue({
        results: [
          {
            caseCaption: 'Samson Workman, Petitioner',
            docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
            docketNumber: '103-19',
            documentTitle: 'Order for More Candy',
            eventCode: 'ODD',
            signedJudgeName: 'Roslindis Angelino',
          },
          {
            caseCaption: 'Samson Workman, Petitioner',
            docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
            docketNumber: '103-19',
            documentTitle: 'Order for KitKats',
            eventCode: 'ODD',
            signedJudgeName: 'Roslindis Angelino',
          },
        ],
        totalCount: 2,
      });
  });

  it('should only search for order document types', async () => {
    await orderPublicSearchInteractor(applicationContext, {
      dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
      keyword: 'fish',
      startDate: '01/01/2001',
    } as any);

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      documentEventCodes: ORDER_EVENT_CODES,
    });
  });

  it('should omit sealed cases and sealed documents from the search results', async () => {
    await orderPublicSearchInteractor(applicationContext, {
      dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
      keyword: 'fish',
      startDate: '01/01/2001',
    } as any);

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      omitSealed: true,
    });
  });

  it('limits results to the default limit (5000) and sets moreResults when more are available', async () => {
    const overLimit = new Array(5001).fill({
      caseCaption: 'Samson Workman, Petitioner',
      docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
      docketNumber: '103-19',
      documentTitle: 'Order for More Candy',
      documentType: 'Order',
      eventCode: 'ODD',
      signedJudgeName: 'Roslindis Angelino',
    });
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue({
        results: overLimit,
      });

    const results = await orderPublicSearchInteractor(applicationContext, {
      dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
      keyword: 'fish',
      startDate: '01/01/2001',
    } as any);

    expect(results.results.length).toBe(5000);
    expect(results.moreResults).toBe(true);
  });

  it('should throw an error when the search results do not validate', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue({
        results: [
          {
            caseCaption: 'Samson Workman, Petitioner',
            docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
            docketNumber: '103-19',
            documentTitle: 'Order for KitKats',
            eventCode: 'ODD',
            numberOfPages: 'green',
            signedJudgeName: 'Roslindis Angelino',
          },
        ],
      });

    await expect(
      orderPublicSearchInteractor(applicationContext, {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: 'fish',
        startDate: '01/01/2001',
      } as any),
    ).rejects.toThrow('entity was invalid');
  });

  it('sets moreResults to false when results are within limit', async () => {
    const response = await orderPublicSearchInteractor(applicationContext, {
      keyword: 'fish',
    } as any);
    expect(response.moreResults).toBe(false);
  });

  it('accumulates across multiple raw batches, trims sentinel, and sets nextCursor to last kept record', async () => {
    const makeBatch = (count: number, startIndex: number) =>
      Array.from({ length: count }).map((_, i) => ({
        caseCaption: 'Caption',
        docketEntryId: `00000000-0000-4000-8000-${String(startIndex + i).padStart(12, '0')}`,
        docketNumber: '123-45',
        documentTitle: 'Some Order',
        documentType: 'Order',
        eventCode: 'ODD',
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

    const result = await orderPublicSearchInteractor(applicationContext, {
      keyword: 'x',
    } as any);

    expect(result.results).toHaveLength(5000);
    expect(result.moreResults).toBe(true);
    expect(result.nextCursor).toEqual([4999]);
    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls.length,
    ).toBe(4);
  });

  it('uses provided cursor as initial searchAfter', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockReset()
      .mockResolvedValueOnce({
        results: [
          {
            caseCaption: 'Caption',
            docketEntryId: '00000000-0000-4000-8000-000000000001',
            docketNumber: '123-45',
            documentTitle: 'Order',
            documentType: 'Order',
            eventCode: 'ODD',
            signedJudgeName: 'Judge',
            sort: [1],
          },
        ],
      })
      .mockResolvedValueOnce({ results: [] });
    const cursor = ['prev'];
    await orderPublicSearchInteractor(applicationContext, {
      cursor,
      keyword: 'y',
    } as any);
    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0].searchAfter,
    ).toBe(cursor);
  });

  it('returns empty results with moreResults false when gateway returns no rows', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockReset()
      .mockResolvedValueOnce({ results: [] });
    const result = await orderPublicSearchInteractor(applicationContext, {
      keyword: 'none',
    } as any);
    expect(result.results).toHaveLength(0);
    expect(result.moreResults).toBe(false);
    expect(result.nextCursor).toBeUndefined();
  });
});
