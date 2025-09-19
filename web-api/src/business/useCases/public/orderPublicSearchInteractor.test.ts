import {
  DATE_RANGE_SEARCH_OPTIONS,
  MAX_DOCUMENT_SEARCH_RESULTS,
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

  it('should restrict search to order event codes', async () => {
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

  it('should omit sealed cases and documents', async () => {
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

  it('should cap at 5000 results when over limit', async () => {
    const overLimit = new Array(MAX_DOCUMENT_SEARCH_RESULTS + 1).fill({
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
  });

  it('should throw when a result fails validation', async () => {
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

  it('should batch internally to top off results', async () => {
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
    const result = await orderPublicSearchInteractor(applicationContext, {
      keyword: 'none',
    } as any);
    expect(result.results).toHaveLength(0);
  });
});
