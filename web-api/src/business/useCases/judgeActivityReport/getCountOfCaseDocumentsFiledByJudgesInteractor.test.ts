import { AggregatedEventCodesType } from '../../../persistence/elasticsearch/fetchEventCodesCountForJudges';
import {
  GetCountOfCaseDocumentsFiledByJudgesRequest,
  getCountOfCaseDocumentsFiledByJudgesInteractor,
} from './getCountOfCaseDocumentsFiledByJudgesInteractor';
import { OPINION_EVENT_CODES_WITH_BENCH_OPINION } from '../../../../../shared/src/business/entities/EntityConstants';
import { addDocumentTypeToEventCodeAggregation } from './addDocumentTypeToEventCodeAggregation';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { judgeUser } from '@shared/test/mockUsers';
import {
  mockCountOfOpinionsIssuedByJudge,
  mockCountOfOrdersIssuedByJudge,
} from '@shared/test/mockSearchResults';
import {
  mockJudgeUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

jest.mock('./addDocumentTypeToEventCodeAggregation');

describe('getCountOfCaseDocumentsFiledByJudgesInteractor', () => {
  const mockStartDate = '02/12/2020';
  const mockEndDate = '03/21/2020';
  const mockJudges = [judgeUser.userId];
  const mockValidRequest: GetCountOfCaseDocumentsFiledByJudgesRequest = {
    documentEventCodes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
    endDate: mockEndDate,
    judgeIds: mockJudges,
    startDate: mockStartDate,
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .fetchEventCodesCountForJudges.mockResolvedValueOnce(
        mockCountOfOpinionsIssuedByJudge,
      )
      .mockResolvedValueOnce(mockCountOfOrdersIssuedByJudge);
  });

  it('should return an error when the user is not authorized to generate the report', async () => {
    await expect(
      getCountOfCaseDocumentsFiledByJudgesInteractor(
        applicationContext,
        mockValidRequest,
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should return an error when the search parameters are not valid', async () => {
    await expect(
      getCountOfCaseDocumentsFiledByJudgesInteractor(
        applicationContext,
        {
          documentEventCodes: [],
          endDate: 'baddabingbaddaboom',
          judgeIds: [judgeUser.userId],
          startDate: 'yabbadabbadoo',
        },
        mockJudgeUser,
      ),
    ).rejects.toThrow();
  });

  it('should make a call to return the case documents filed by the judge provided in the date range provided, sorted by eventCode (ascending)', async () => {
    const results: AggregatedEventCodesType =
      await getCountOfCaseDocumentsFiledByJudgesInteractor(
        applicationContext,
        mockValidRequest,
        mockJudgeUser,
      );

    expect(
      applicationContext.getPersistenceGateway().fetchEventCodesCountForJudges
        .mock.calls[0][0],
    ).toMatchObject({
      params: {
        documentEventCodes: OPINION_EVENT_CODES_WITH_BENCH_OPINION,
        endDate: '2020-03-22T03:59:59.999Z',
        judges: mockJudges,
        startDate: '2020-02-12T05:00:00.000Z',
      },
    });

    expect(addDocumentTypeToEventCodeAggregation).toHaveBeenCalled();
    expect(results).toEqual(mockCountOfOpinionsIssuedByJudge);
  });
});
