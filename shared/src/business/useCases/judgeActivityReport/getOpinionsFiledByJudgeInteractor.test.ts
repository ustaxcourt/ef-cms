import { MAX_ELASTICSEARCH_PAGINATION } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getOpinionsFiledByJudgeInteractor } from './getOpinionsFiledByJudgeInteractor';
import { judgeUser, petitionsClerkUser } from '../../../test/mockUsers';

describe('getOpinionsFiledByJudgeInteractor', () => {
  const judgesSelection = ['Colvin', 'Buch'];

  const mockStartDate = '2020-03-22T03:59:59.999Z';
  const mockEndDate = '2020-03-23T03:59:59.999Z';

  const mockValidRequest = {
    endDate: mockEndDate,
    judgesSelection,
    startDate: mockStartDate,
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
        judgesSelection,
        startDate: 'yabbadabbadoo',
      }),
    ).rejects.toThrow();

    await expect(
      getOpinionsFiledByJudgeInteractor(applicationContext, {
        endDate: mockEndDate,
        judgesSelection: [],
        startDate: mockStartDate,
      }),
    ).rejects.toThrow();
  });

  it('should return the opinions filed by the judge provided in the date range provided, sorted by eventCode (ascending)', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValueOnce({
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

    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue({
        results: [
          {
            caseCaption: 'James Bond, Petitioner',
            docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
            docketNumber: '105-19',
            documentTitle: 'T.C. Opinion for Rainy Skies',
            documentType: 'T.C. Opinion',
            eventCode: 'TCOP',
            signedJudgeName: 'Guy Fieri',
          },
          {
            caseCaption: 'Nelson Mandela, Petitioner',
            docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
            docketNumber: '106-19',
            documentTitle: 'Memorandum Opinion Judge Fieri Flight to Africa',
            documentType: 'Memorandum Opinion',
            eventCode: 'MOP',
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
      endDate: mockEndDate,
      judge: mockValidRequest.judgesSelection[0],
      overrideResultSize: MAX_ELASTICSEARCH_PAGINATION,
      startDate: mockStartDate,
    });

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[1][0],
    ).toMatchObject({
      endDate: mockEndDate,
      judge: mockValidRequest.judgesSelection[1],
      overrideResultSize: MAX_ELASTICSEARCH_PAGINATION,
      startDate: mockStartDate,
    });

    expect(result).toEqual([
      { count: 1, documentType: 'Memorandum Opinion', eventCode: 'MOP' },
      {
        count: 0,
        documentType: 'Order of Service of Transcript (Bench Opinion)',
        eventCode: 'OST',
      },
      { count: 1, documentType: 'Summary Opinion', eventCode: 'SOP' },
      { count: 2, documentType: 'T.C. Opinion', eventCode: 'TCOP' },
    ]);
  });
});
