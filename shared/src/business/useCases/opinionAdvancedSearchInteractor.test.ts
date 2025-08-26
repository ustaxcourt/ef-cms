import {
  DATE_RANGE_SEARCH_OPTIONS,
  MAX_SEARCH_RESULTS,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
} from '../../business/entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { opinionAdvancedSearchInteractor } from './opinionAdvancedSearchInteractor';

describe('opinionAdvancedSearchInteractor', () => {
  it('fetches two batches of 5000 results when more than 5000 are available', async () => {
    const batchSize = 5000;
    const firstBatch = new Array(batchSize).fill({
      caseCaption: 'Batch1',
      docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
      docketNumber: '100-01',
      documentTitle: 'Opinion',
      eventCode: 'TCOP',
      signedJudgeName: 'Judge1',
    });
    const secondBatch = new Array(batchSize).fill({
      caseCaption: 'Batch2',
      docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e548',
      docketNumber: '100-02',
      documentTitle: 'Opinion',
      eventCode: 'SOP',
      signedJudgeName: 'Judge2',
    });

    let callCount = 0;
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockImplementation(({ from }) => {
        callCount++;
        if (from === 0) {
          return Promise.resolve({
            results: firstBatch,
            totalCount: batchSize * 2,
          });
        }
        return Promise.resolve({
          results: secondBatch,
          totalCount: batchSize * 2,
        });
      });

    const firstHalf = await opinionAdvancedSearchInteractor(
      applicationContext,
      {
        keyword: 'keyword',
        opinionTypes: ['TCOP', 'SOP'],
        from: 0,
        limit: 5000,
      } as any,
      mockPetitionsClerkUser,
    );

    const secondHalf = await opinionAdvancedSearchInteractor(
      applicationContext,
      {
        keyword: 'keyword',
        opinionTypes: ['TCOP', 'SOP'],
        from: 5000,
        limit: 5000,
      } as any,
      mockPetitionsClerkUser,
    );
    const combinedResults = [...firstHalf.results, ...secondHalf.results];

    expect(combinedResults.length).toBe(10000);
    expect(callCount).toBe(2);
  });
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

  it('returns an unauthorized error on petitioner user role', async () => {
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

    const results = await opinionAdvancedSearchInteractor(
      applicationContext,
      {
        keyword: 'keyword',
        petitionerName: 'test person',
      } as any,
      mockPetitionsClerkUser,
    );

    expect(results.results.length).toBe(MAX_SEARCH_RESULTS); // Interactor limits results
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
});
