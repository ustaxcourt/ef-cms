import { JudgeActivityReportFilters } from './getTrialSessionsForJudgeActivityReportInteractor';
import {
  MAX_ELASTICSEARCH_PAGINATION,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
} from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getOpinionsFiledByJudgeInteractor } from './getOpinionsFiledByJudgeInteractor';
import { judgeUser, petitionsClerkUser } from '../../../test/mockUsers';

export const mockOpinionsFiledByJudge = [
  { count: 0, documentType: 'Memorandum Opinion', eventCode: 'MOP' },
  {
    count: 0,
    documentType: 'Order of Service of Transcript (Bench Opinion)',
    eventCode: 'OST',
  },
  { count: 1, documentType: 'Summary Opinion', eventCode: 'SOP' },
  { count: 1, documentType: 'T.C. Opinion', eventCode: 'TCOP' },
];

describe('getOpinionsFiledByJudgeInteractor', () => {
  const mockClientConnectionID = 'clientConnnectionID';
  const mockStartDate = '02/12/2020';
  const mockEndDate = '03/21/2020';
  const mockValidRequest: JudgeActivityReportFilters = {
    clientConnectionId: mockClientConnectionID,
    endDate: mockEndDate,
    judges: [judgeUser.name],
    startDate: mockStartDate,
  };

  const mockOrdersResultFromPersistence = {
    results: [
      {
        caseCaption: 'Samson Workman, Petitioner',
        docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
        docketNumber: '103-19',
        documentTitle: 'T.C. Opinion for More Candy',
        documentType: 'T.C. Opinion',
        eventCode: 'TCOP',
        signedJudgeName: 'Guy Fieri',
      },
      {
        caseCaption: 'Samson Workman, Petitioner',
        docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
        docketNumber: '103-19',
        documentTitle: 'Summary Opinion for KitKats',
        documentType: 'Summary Opinion',
        eventCode: 'SOP',
        signedJudgeName: 'Guy Fieri',
      },
    ],
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);
  });

  it('should return an error when the user is not authorized to generate the report', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    await expect(
      getOpinionsFiledByJudgeInteractor(applicationContext, mockValidRequest),
    ).rejects.toThrow('Unauthorized');
  });

  it('should return an error when the search parameters are not valid', async () => {
    await expect(
      getOpinionsFiledByJudgeInteractor(applicationContext, {
        endDate: 'baddabingbaddaboom',
        judges: [judgeUser.name],
        startDate: 'yabbadabbadoo',
      }),
    ).rejects.toThrow();
  });

  it('should make a call to return the opinions filed by the judge provided in the date range provided, sorted by eventCode (ascending)', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue(
        mockOrdersResultFromPersistence,
      );

    await getOpinionsFiledByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      documentEventCodes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
      endDate: '2020-03-22T03:59:59.999Z',
      isOpinionSearch: true,
      judge: judgeUser.name,
      overrideResultSize: MAX_ELASTICSEARCH_PAGINATION,
      startDate: '2020-02-12T05:00:00.000Z',
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      clientConnectionId: mockValidRequest.clientConnectionId,
      message: {
        action: 'fetch_opinions_complete',
        opinions: mockOpinionsFiledByJudge,
      },
      userId: judgeUser.userId,
    });
  });
});
