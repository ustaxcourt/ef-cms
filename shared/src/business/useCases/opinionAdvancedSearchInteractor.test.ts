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

  it('should return results when the current user has permission to perform advanced opinion searches (petitionsclerk)', async () => {
    const result = await opinionAdvancedSearchInteractor(
      applicationContext,
      {
        dateRange: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        keyword: 'candy',
        startDate: '01/01/2001',
      } as any,
      mockPetitionsClerkUser,
    );

    expect(result).toMatchObject([
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
    ]);
  });

  it('should return no more than MAX_SEARCH_RESULTS', async () => {
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

    expect(results.length).toBe(MAX_SEARCH_RESULTS);
  });

  it('should search for documents that are of type opinions', async () => {
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
