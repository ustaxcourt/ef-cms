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
});
