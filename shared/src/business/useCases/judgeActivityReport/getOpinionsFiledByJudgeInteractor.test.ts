import { MAX_ELASTICSEARCH_PAGINATION } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getOpinionsFiledByJudgeInteractor } from './getOpinionsFiledByJudgeInteractor';
import { judgeUser, petitionsClerkUser } from '../../../test/mockUsers';

describe('getOpinionsFiledByJudgeInteractor', () => {
  const mockValidRequest = {
    endDate: '03/21/2020',
    judgeName: judgeUser.name,
    startDate: '02/12/2020',
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
        judgeName: judgeUser.name,
        startDate: 'yabbadabbadoo',
      }),
    ).rejects.toThrow();
  });

  it('should return the opinions filed by the judge provided in the date range provided, sorted by eventCode (ascending)', async () => {
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
      });

    const result = await getOpinionsFiledByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      endDate: '2020-03-22T03:59:59.999Z',
      judge: mockValidRequest.judgeName,
      overrideResultSize: MAX_ELASTICSEARCH_PAGINATION,
      startDate: '2020-02-12T05:00:00.000Z',
    });
    expect(result).toEqual([
      { count: 0, documentType: 'Memorandum Opinion', eventCode: 'MOP' },
      {
        count: 0,
        documentType: 'Order of Service of Transcript (Bench Opinion)',
        eventCode: 'OST',
      },
      { count: 1, documentType: 'Summary Opinion', eventCode: 'SOP' },
      { count: 1, documentType: 'T.C. Opinion', eventCode: 'TCOP' },
    ]);
  });
});
