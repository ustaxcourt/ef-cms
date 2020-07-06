const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  COUNTRY_TYPES,
  OPINION_EVENT_CODES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const {
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  deconstructDate,
} = require('../../utilities/DateHandler');
const {
  getTodaysOpinionsInteractor,
} = require('./getTodaysOpinionsInteractor');

describe('getTodaysOpinionsInteractor', () => {
  const mockOpinionSearchResult = [
    {
      caseCaption: 'Reuben Blair, Petitioner',
      caseId: '24fcb050-9c95-4d69-a149-96acba0196b8',
      contactPrimary: {
        address1: '66 East Clarendon Parkway',
        address2: 'Ut culpa cum sint ',
        address3: 'In laboris hic volup',
        city: 'Omnis dignissimos at',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'petitioner',
        name: 'Reuben Blair',
        phone: '+1 (338) 996-7072',
        postalCode: '92017',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        state: 'DC',
      },
      contactSecondary: {},
      docketNumber: '103-20',
      docketNumberSuffix: 'L',
      documentId: '6945cdff-fd12-422b-bf2c-63b792b7f618',
      documentTitle: 'Memorandum Opinion Judge Armen',
      filingDate: '2020-05-12T18:42:10.471Z',
      irsPractitioners: [],
      isSealed: false,
      numberOfPages: 1,
      privatePractitioners: [],
      signedJudgeName: 'Maurice B. Foley',
    },
  ];

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue(mockOpinionSearchResult);
  });

  it('should only search for opinion document types', async () => {
    await getTodaysOpinionsInteractor({
      applicationContext,
    });

    const { day, month, year } = deconstructDate(createISODateString());
    const currentDateStart = createStartOfDayISO({ day, month, year });
    const currentDateEnd = createEndOfDayISO({ day, month, year });

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      documentEventCodes: OPINION_EVENT_CODES,
      endDate: currentDateEnd,
      startDate: currentDateStart,
    });
  });
});
