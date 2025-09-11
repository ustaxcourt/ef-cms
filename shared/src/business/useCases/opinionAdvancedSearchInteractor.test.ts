import {
  DATE_RANGE_SEARCH_OPTIONS,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { opinionAdvancedSearchInteractor } from '@shared/business/useCases/opinionAdvancedSearchInteractor';

describe('opinionAdvancedSearchInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue({
        results: [
          {
            caseCaption: 'Samson Workman, Petitioner',
            docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
            docketNumber: '103-19',
            documentTitle: 'T.C. Opinion for More Candy',
            documentType: 'T.C. Opinion',
            eventCode: 'TCOP',
            signedJudgeName: 'Roslindis Angelino',
          },
          {
            caseCaption: 'Samson Workman, Petitioner',
            docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
            docketNumber: '103-19',
            documentTitle: 'Summary Opinion for KitKats',
            documentType: 'Summary Opinion',
            eventCode: 'SOP',
            signedJudgeName: 'Roslindis Angelino',
          },
        ],
        totalCount: 2,
      });
  });

  it('should return an unauthorized error when the currentUser is a petitioner', async () => {
    await expect(
      opinionAdvancedSearchInteractor(
        applicationContext,
        {} as any,
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('logs raw search information and results size', async () => {
    await opinionAdvancedSearchInteractor(
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
      userRole: mockPetitionsClerkUser.role,
    });
  });

  it('limits results to the default limit (5000) and indicates moreResults when more are available', async () => {
    const overLimit = new Array(5001).fill({
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
      .advancedDocumentSearch.mockResolvedValue({
        results: overLimit,
      });

    const results = await opinionAdvancedSearchInteractor(
      applicationContext,
      {
        keyword: 'keyword',
      } as any,
      mockPetitionsClerkUser,
    );

    expect(results.results.length).toBe(5000);
    expect(results.moreResults).toBe(true);
  });

  it('searches for documents that are of type opinions', async () => {
    const keyword = 'keyword';
    await opinionAdvancedSearchInteractor(
      applicationContext,
      {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword,
        opinionTypes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
        startDate: '01/01/2001',
      } as any,
      mockPetitionsClerkUser,
    );
    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      documentEventCodes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
    });
  });

  it('should search for opinions with isOpinionSearch set to true', async () => {
    await opinionAdvancedSearchInteractor(
      applicationContext,
      {} as any,
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      isOpinionSearch: true,
    });
  });

  it('sets moreResults to false when number of results is within limit', async () => {
    const response = await opinionAdvancedSearchInteractor(
      applicationContext,
      {
        keyword: 'candy',
        opinionTypes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
      } as any,
      mockPetitionsClerkUser,
    );
    expect(response.moreResults).toBe(false);
  });

  it('accumulates across multiple raw batches, trims sentinel, and sets nextCursor to last kept record', async () => {
    const makeBatch = (count: number, startIndex: number) =>
      Array.from({ length: count }).map((_, i) => ({
        caseCaption: 'Caption',
        docketEntryId: `00000000-0000-4000-8000-${String(startIndex + i).padStart(12, '0')}`,
        docketNumber: '123-45',
        documentTitle: 'Some Opinion',
        documentType: 'T.C. Opinion',
        eventCode: 'TCOP',
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

    const result = await opinionAdvancedSearchInteractor(
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
    ).toBe(4);
  });

  it('uses provided cursor as initial searchAfter', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockReset()
      .mockResolvedValueOnce({
        results: [
          {
            caseCaption: 'Caption',
            docketEntryId: '00000000-0000-4000-8000-000000000001',
            docketNumber: '123-45',
            documentTitle: 'Opinion',
            documentType: 'T.C. Opinion',
            eventCode: 'TCOP',
            signedJudgeName: 'Judge',
            sort: [1],
          },
        ],
      })
      .mockResolvedValueOnce({ results: [] });

    const cursor = ['a', 'b'];
    await opinionAdvancedSearchInteractor(
      applicationContext,
      { cursor, keyword: 'y' } as any,
      mockPetitionsClerkUser,
    );
    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0].searchAfter,
    ).toBe(cursor);
  });

  it('returns empty results with moreResults false when gateway returns no rows', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockReset()
      .mockResolvedValueOnce({ results: [] });

    const result = await opinionAdvancedSearchInteractor(
      applicationContext,
      { keyword: 'none' } as any,
      mockPetitionsClerkUser,
    );
    expect(result.results).toHaveLength(0);
    expect(result.moreResults).toBe(false);
    expect(result.nextCursor).toBeUndefined();
  });

  it('throws when a returned opinion search result fails validation', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockReset()
      .mockResolvedValueOnce({
        results: [
          {
            caseCaption: 'Bad Opinion',
            docketEntryId: '00000000-0000-4000-8000-000000000099',
            docketNumber: '999-99',
            documentTitle: 'Broken Opinion',
            documentType: 'T.C. Opinion',
            eventCode: 'TCOP',
            signedJudgeName: 'Judge',
            numberOfPages: 'green',
          },
        ],
      });
    await expect(
      opinionAdvancedSearchInteractor(
        applicationContext,
        {
          keyword: 'bad',
          opinionTypes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
        } as any,
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('entity was invalid');
  });
});
