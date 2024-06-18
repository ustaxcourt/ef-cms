import {
  DATE_RANGE_SEARCH_OPTIONS,
  MAX_SEARCH_RESULTS,
  ORDER_EVENT_CODES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
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
            signedJudgeName: 'Guy Fieri',
          },
          {
            caseCaption: 'Samson Workman, Petitioner',
            docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
            docketNumber: '103-19',
            documentTitle: 'Order for KitKats',
            eventCode: 'ODD',
            signedJudgeName: 'Guy Fieri',
          },
        ],
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

  it('should limit results length to MAX_SEARCH_RESULTS', async () => {
    const maxPlusOneResults = new Array(MAX_SEARCH_RESULTS + 1).fill({
      caseCaption: 'Samson Workman, Petitioner',
      docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
      docketNumber: '103-19',
      documentTitle: 'Order for More Candy',
      documentType: 'Order',
      eventCode: 'O',
      signedJudgeName: 'Guy Fieri',
    });
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue({ results: maxPlusOneResults });

    const results = await orderPublicSearchInteractor(applicationContext, {
      dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
      keyword: 'fish',
      startDate: '01/01/2001',
    } as any);

    expect(results.length).toBe(MAX_SEARCH_RESULTS);
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
            signedJudgeName: 'Guy Fieri',
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
});
