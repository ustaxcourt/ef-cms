import {
  JudgeActivityReportFilters,
  OpinionsReturnType,
} from '@web-client/presenter/judgeActivityReportState';
import { OPINION_EVENT_CODES_WITH_BENCH_OPINION } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getOpinionsFiledByJudgeInteractor } from './getOpinionsFiledByJudgeInteractor';
import { judgeUser, petitionsClerkUser } from '../../../test/mockUsers';

export const mockOpinionsFiledByJudge = [
  { count: 177, documentType: 'Memorandum Opinion', eventCode: 'MOP' },
  {
    count: 53,
    documentType: 'Order of Service of Transcript (Bench Opinion)',
    eventCode: 'OST',
  },
  { count: 34, documentType: 'Summary Opinion', eventCode: 'SOP' },
  { count: 30, documentType: 'T.C. Opinion', eventCode: 'TCOP' },
];

export const mockOpinionsFiledTotal = 269;

export const mockOpinionsAggregated: OpinionsReturnType = {
  aggregations: mockOpinionsFiledByJudge,
  total: mockOpinionsFiledTotal,
};

describe('getOpinionsFiledByJudgeInteractor', () => {
  const mockStartDate = '02/12/2020';
  const mockEndDate = '03/21/2020';
  const mockJudges = [judgeUser.name];
  const mockValidRequest: JudgeActivityReportFilters = {
    endDate: mockEndDate,
    judges: mockJudges,
    startDate: mockStartDate,
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    applicationContext
      .getPersistenceGateway()
      .fetchEventCodesCountForJudges.mockResolvedValue(mockOpinionsAggregated);
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
    const opinions = await getOpinionsFiledByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(
      applicationContext.getPersistenceGateway().fetchEventCodesCountForJudges
        .mock.calls[0][0],
    ).toMatchObject({
      params: {
        documentEventCodes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
        endDate: '2020-03-22T03:59:59.999Z',
        judges: mockJudges,
        searchType: 'opinion',
        startDate: '2020-02-12T05:00:00.000Z',
      },
    });

    expect(opinions).toEqual(mockOpinionsAggregated);
  });
});
