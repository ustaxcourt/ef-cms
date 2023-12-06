import {
  DATE_RANGE_SEARCH_OPTIONS,
  MAX_SEARCH_RESULTS,
  ORDER_EVENT_CODES,
  ROLES,
} from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { orderAdvancedSearchInteractor } from './orderAdvancedSearchInteractor';
import { petitionerUser, petitionsClerkUser } from '@shared/test/mockUsers';

describe('orderAdvancedSearchInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

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
            signedJudgeName: 'Guy Fieri',
          },
          {
            caseCaption: 'Samson Workman, Petitioner',
            docketEntryId: 'db3ed57e-cfca-4228-ad5c-547484b1a801',
            docketNumber: '103-19',
            docketNumberSuffix: 'AAA',
            documentContents: 'KitKats are inferior candies',
            documentTitle: 'Order for KitKats',
            eventCode: 'ODD',
            signedJudgeName: 'Guy Fieri',
          },
        ],
        totalCount: 2,
      });
  });

  it('returns an unauthorized error on petitioner user role', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    await expect(
      orderAdvancedSearchInteractor(applicationContext, {} as any),
    ).rejects.toThrow('Unauthorized');
  });

  it('logs raw search information and results size', async () => {
    const result = await orderAdvancedSearchInteractor(applicationContext, {
      dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
      keyword: 'candy',
      startDate: '01/01/2001',
    } as any);

    expect(applicationContext.logger.info.mock.calls[0][1]).toMatchObject({
      from: 0,
      timestamp: expect.anything(),
      totalCount: result.length,
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
      signedJudgeName: 'Guy Fieri',
    });
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue({ results: maxPlusOneResults });

    const results = await orderAdvancedSearchInteractor(applicationContext, {
      keyword: 'keyword',
      petitionerName: 'test person',
    } as any);

    expect(results.length).toBe(MAX_SEARCH_RESULTS);
  });

  it('searches for documents that are of type orders', async () => {
    const keyword = 'keyword';

    await orderAdvancedSearchInteractor(applicationContext, {
      dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
      keyword,
      startDate: '01/01/2001',
    } as any);

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      documentEventCodes: ORDER_EVENT_CODES,
    });
  });
});
