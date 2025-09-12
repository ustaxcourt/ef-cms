import {
  DATE_RANGE_SEARCH_OPTIONS,
  ORDER_EVENT_CODES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { orderAdvancedSearchInteractor } from './orderAdvancedSearchInteractor';

describe('orderAdvancedSearchInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue({
        results: [
          {
            caseCaption: 'Samson Workman, Petitioner',
            docketEntryId: 'db3ed57e-cfca-4228-ad5c-547484b1a801',
            docketNumber: '103-19',
            docketNumberSuffix: 'AAA',
            documentContents:
              'Everyone knows that Reeses Outrageous bars are the best candy',
            documentTitle: 'Order for More Candy',
            eventCode: 'ODD',
            signedJudgeName: 'Roslindis Angelino',
          },
          {
            caseCaption: 'Samson Workman, Petitioner',
            docketEntryId: 'db3ed57e-cfca-4228-ad5c-547484b1a801',
            docketNumber: '103-19',
            docketNumberSuffix: 'AAA',
            documentContents: 'KitKats are inferior candies',
            documentTitle: 'Order for KitKats',
            eventCode: 'ODD',
            signedJudgeName: 'Roslindis Angelino',
          },
        ],
        totalCount: 2,
      });
  });

  it('should throw Unauthorized for a petitioner user', async () => {
    await expect(
      orderAdvancedSearchInteractor(
        applicationContext,
        {} as any,
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should log search params and result size', async () => {
    await orderAdvancedSearchInteractor(
      applicationContext,
      {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: 'candy',
        startDate: '01/01/2001',
      } as any,
      mockPetitionsClerkUser,
    );

    expect(applicationContext.logger.info.mock.calls[0][1]).toMatchObject({
      from: 0,
      timestamp: expect.anything(),
      userRole: ROLES.petitionsClerk,
    });
  });

  it('should cap at 5000 results and set moreResults true when over limit', async () => {
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

    const results = await orderAdvancedSearchInteractor(
      applicationContext,
      {
        keyword: 'keyword',
      } as any,
      mockPetitionsClerkUser,
    );
    expect(results.results.length).toBe(5000);
    expect(results.moreResults).toBe(true);
  });

  it('should restrict search to order event codes', async () => {
    const keyword = 'keyword';

    await orderAdvancedSearchInteractor(
      applicationContext,
      {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword,
        startDate: '01/01/2001',
      } as any,
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      documentEventCodes: ORDER_EVENT_CODES,
    });
  });

  it('should set moreResults false when results within limit', async () => {
    const response = await orderAdvancedSearchInteractor(
      applicationContext,
      { keyword: 'candy' } as any,
      mockPetitionsClerkUser,
    );
    expect(response.moreResults).toBe(false);
  });

  it('should paginate across batches and return nextCursor', async () => {
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

    const result = await orderAdvancedSearchInteractor(
      applicationContext,
      { keyword: 'x' } as any,
      mockPetitionsClerkUser,
    );
    expect(result.results).toHaveLength(5000);
    expect(result.moreResults).toBe(true);
    expect(result.nextCursor).toEqual([4999]);
    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls.length,
    ).toBeGreaterThan(1);
  });

  it('should use provided cursor as searchAfter', async () => {
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
    const cursor = ['c1'];
    await orderAdvancedSearchInteractor(
      applicationContext,
      { cursor, keyword: 'y' } as any,
      mockPetitionsClerkUser,
    );
    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0].searchAfter,
    ).toBe(cursor);
  });

  it('should return empty results and moreResults false when no matches', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockReset()
      .mockResolvedValueOnce({ results: [] });

    const result = await orderAdvancedSearchInteractor(
      applicationContext,
      { keyword: 'none' } as any,
      mockPetitionsClerkUser,
    );
    expect(result.results).toHaveLength(0);
    expect(result.moreResults).toBe(false);
    expect(result.nextCursor).toBeUndefined();
  });

  it('should throw when a result fails validation', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockReset()
      .mockResolvedValueOnce({
        results: [
          {
            caseCaption: 'Bad Order',
            docketEntryId: '00000000-0000-4000-8000-000000000199',
            docketNumber: '321-21',
            documentTitle: 'Broken Order',
            documentType: 'Order',
            eventCode: 'ODD',
            signedJudgeName: 'Judge',
            numberOfPages: 'blue',
          },
        ],
      });
    await expect(
      orderAdvancedSearchInteractor(
        applicationContext,
        { keyword: 'bad' } as any,
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('entity was invalid');
  });
});
