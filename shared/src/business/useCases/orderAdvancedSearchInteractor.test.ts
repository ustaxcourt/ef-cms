import {
  DATE_RANGE_SEARCH_OPTIONS,
  MAX_SEARCH_RESULTS,
  ORDER_EVENT_CODES,
  ROLES,
} from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { orderAdvancedSearchInteractor } from './orderAdvancedSearchInteractor';

describe('orderAdvancedSearchInteractor', () => {
  it('fetches multiple batches when results exceed batch size', async () => {
    const batchSize = 1000;
    const firstBatch = new Array(batchSize).fill({
      caseCaption: 'Batch1',
      docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
      docketNumber: '100-01',
      documentTitle: 'Order',
      eventCode: 'ODD',
      signedJudgeName: 'Judge1',
    });
    const secondBatch = [
      {
        caseCaption: 'Batch2',
        docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e548',
        docketNumber: '100-02',
        documentTitle: 'Order',
        eventCode: 'ODD',
        signedJudgeName: 'Judge2',
      },
    ];

    let callCount = 0;
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({
            results: firstBatch,
            totalCount: batchSize + 1,
          });
        }
        return Promise.resolve({
          results: secondBatch,
          totalCount: batchSize + 1,
        });
      });

    const results = await orderAdvancedSearchInteractor(
      applicationContext,
      {
        keyword: 'keyword',
        petitionerName: 'test person',
      } as any,
      mockPetitionsClerkUser,
    );

    expect(results.results.length).toBe(batchSize + 1);
    expect(callCount).toBe(2);
  });
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

  it('returns an unauthorized error on petitioner user role', async () => {
    await expect(
      orderAdvancedSearchInteractor(
        applicationContext,
        {} as any,
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('logs raw search information and results size', async () => {
    const result = await orderAdvancedSearchInteractor(
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
      totalCount: result.results.length,
      userRole: ROLES.petitionsClerk,
    });
  });

  it('returns no more than MAX_SEARCH_RESULTS', async () => {
    const maxPlusOneResults = new Array(MAX_SEARCH_RESULTS + 1).fill({
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
      .advancedDocumentSearch.mockResolvedValue({ results: maxPlusOneResults });

    const results = await orderAdvancedSearchInteractor(
      applicationContext,
      {
        keyword: 'keyword',
        petitionerName: 'test person',
      } as any,
      mockPetitionsClerkUser,
    );

    expect(results.results.length).toBe(MAX_SEARCH_RESULTS);
  });

  it('searches for documents that are of type orders', async () => {
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
});
