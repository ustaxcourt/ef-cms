const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  deconstructDate,
} = require('../../utilities/DateHandler');
const {
  ORDER_EVENT_CODES,
  ORDER_JUDGE_FIELD,
  TODAYS_ORDERS_PAGE_SIZE,
} = require('../../entities/EntityConstants');
const { getTodaysOrdersInteractor } = require('./getTodaysOrdersInteractor');

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
    await getTodaysOrdersInteractor({
      applicationContext,
    });

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

    await getTodaysOrdersInteractor({
      applicationContext,
      page: mockCurrentPage,
    });

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0].from,
    ).toBe((mockCurrentPage - 1) * TODAYS_ORDERS_PAGE_SIZE);
  });

  it('should make a call to advancedDocumentSearch with judgeType set to signedJudgeName', async () => {
    await getTodaysOrdersInteractor({
      applicationContext,
      page: 1,
    });

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0].judgeType,
    ).toBe(ORDER_JUDGE_FIELD);
  });

  it('should filter out order documents belonging to sealed cases', async () => {
    await getTodaysOrdersInteractor({
      applicationContext,
    });

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0].omitSealed,
    ).toBeTruthy();
  });

  it('should make a call to advancedDocumentSearch with the result page size and sort overridden', async () => {
    await getTodaysOrdersInteractor({
      applicationContext,
      page: 1,
    });

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0].overrideResultSize,
    ).toBe(TODAYS_ORDERS_PAGE_SIZE);
    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0].overrideSort,
    ).toBe(true);
  });

  it('should return the results and totalCount of results', async () => {
    const result = await getTodaysOrdersInteractor({
      applicationContext,
      page: 1,
    });

    expect(result.results).toBeDefined();
    expect(result.totalCount).toBeDefined();
  });
});
