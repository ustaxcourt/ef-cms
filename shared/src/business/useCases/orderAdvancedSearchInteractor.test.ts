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

  it('limits results to the default limit (5000) and indicates moreResults when more are available', async () => {
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

  it('sets moreResults to false when number of results is within limit', async () => {
    const response = await orderAdvancedSearchInteractor(
      applicationContext,
      { keyword: 'candy' } as any,
      mockPetitionsClerkUser,
    );
    expect(response.moreResults).toBe(false);
  });
});
