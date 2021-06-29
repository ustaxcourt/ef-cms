const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  MAX_SEARCH_RESULTS,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
} = require('../../entities/EntityConstants');
const {
  opinionPublicSearchInteractor,
} = require('./opinionPublicSearchInteractor');

describe('opinionPublicSearchInteractor', () => {
  const mockOpinionSearchResult = [
    {
      caseCaption: 'Reuben Blair, Petitioner',
      docketEntryId: '6945cdff-fd12-422b-bf2c-63b792b7f618',
      docketNumber: '103-20',
      documentTitle: 'Memorandum Opinion Judge Colvin',
      entityName: 'PublicDocumentSearchResult',
      filingDate: '2020-05-12T18:42:10.471Z',
      isSealed: false,
      numberOfPages: 1,
      signedJudgeName: 'Maurice B. Foley',
    },
  ];

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue({
        results: mockOpinionSearchResult,
      });
  });

  it('should only search for opinion document types, allowing opinions within sealed cases', async () => {
    await opinionPublicSearchInteractor(applicationContext, {
      keyword: 'fish',
      startDate: '2001-01-01',
    });

    const searchArgs =
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0];
    expect(searchArgs.documentEventCodes).toMatchObject(
      OPINION_EVENT_CODES_WITH_BENCH_OPINION,
    );
    expect(searchArgs.omitSealed).toBeUndefined();
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

    const results = await opinionPublicSearchInteractor(applicationContext, {
      keyword: 'fish',
      startDate: '2001-01-01',
    });

    expect(results.length).toBe(MAX_SEARCH_RESULTS);
  });

  it('should return search results based on the supplied opinion keyword', async () => {
    const result = await opinionPublicSearchInteractor(applicationContext, {
      keyword: 'memorandum',
      startDate: '2001-01-01',
    });

    expect(result).toEqual(mockOpinionSearchResult);
  });

  it('does NOT filter out opinion results belonging to sealed cases', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue({ sealedDate: 'some date' });
    const results = await opinionPublicSearchInteractor(applicationContext, {
      keyword: 'fish',
      startDate: '2001-01-01',
    });
    expect(results.length).toBe(1);
  });
});
