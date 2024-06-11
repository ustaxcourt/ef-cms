import {
  ORDER_EVENT_CODES,
  TODAYS_ORDERS_PAGE_SIZE,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  deconstructDate,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { getTodaysOrdersInteractor } from './getTodaysOrdersInteractor';

describe('getTodaysOrdersInteractor', () => {
  const mockOrderSearchResults = {
    results: [
      {
        _score: 8.051047,
        caseCaption: 'Idola Flowers, Donor, Petitioner',
        contactPrimary: {
          address1: '27 South Cowley Extension',
          address2: 'Ab sed culpa aliquam',
          address3: 'Sunt nihil pariatur',
          city: 'Ullamco culpa eos n',
          contactId: '1566ea80-1d95-42bc-b006-7fc55c698dea',
          countryType: 'domestic',
          isAddressSealed: false,
          name: 'Idola Flowers',
          phone: '+1 (166) 728-1619',
          postalCode: '64258',
          sealedAndUnavailable: false,
          serviceIndicator: 'Paper',
          state: 'VA',
        },
        docketEntryId: 'f5ed9568-7510-427f-b392-aa5b724aca30',
        docketNumber: '121-20',
        docketNumberWithSuffix: '121-20',
        documentTitle: 'Order to Show Cause blah blah blah',
        documentType: 'Order to Show Cause',
        eventCode: 'OSC',
        filingDate: '2020-12-22T17:46:10.158Z',
        irsPractitioners: [],
        isSealed: false,
        isStricken: false,
        numberOfPages: 1,
        privatePractitioners: [],
        signedJudgeName: 'Maurice B. Foley',
      },
    ],
    totalCount: 45,
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue(mockOrderSearchResults);
  });

  it('should only search for order document types for today', async () => {
    await getTodaysOrdersInteractor(applicationContext, {} as any);

    const { day, month, year } = deconstructDate(createISODateString());
    const currentDateStart = createStartOfDayISO({ day, month, year });
    const currentDateEnd = createEndOfDayISO({ day, month, year });

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      documentEventCodes: ORDER_EVENT_CODES,
      endDate: currentDateEnd,
      startDate: currentDateStart,
    });
  });

  it('should search for the next set of results starting from the current result page', async () => {
    const mockCurrentPage = 3;

    await getTodaysOrdersInteractor(applicationContext, {
      page: mockCurrentPage,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0].from,
    ).toBe((mockCurrentPage - 1) * TODAYS_ORDERS_PAGE_SIZE);
  });

  it('should filter out order documents belonging to sealed cases', async () => {
    await getTodaysOrdersInteractor(applicationContext, {} as any);

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0].omitSealed,
    ).toBeTruthy();
  });

  it('should make a call to advancedDocumentSearch with the result page size overridden and default sort order', async () => {
    await getTodaysOrdersInteractor(applicationContext, {
      page: 1,
      todaysOrdersSort: 'filingDateDesc',
    });

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0].overrideResultSize,
    ).toBe(TODAYS_ORDERS_PAGE_SIZE);
    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0].sortField,
    ).toBe('filingDateDesc');
  });

  it('should return the results and totalCount of results', async () => {
    const result = await getTodaysOrdersInteractor(applicationContext, {
      page: 1,
    } as any);

    expect(result.results).toBeDefined();
    expect(result.totalCount).toBeDefined();
  });
});
