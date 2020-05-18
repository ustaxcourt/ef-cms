const {
  opinionAdvancedSearchInteractor,
} = require('./opinionAdvancedSearchInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { Document } = require('../../business/entities/Document');

describe('opinionAdvancedSearchInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'petitionsclerk',
    });

    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue([
        {
          caseCaption: 'Samson Workman, Petitioner',
          caseId: '1',
          docketNumber: '103-19',
          docketNumberSuffix: 'AAA',
          documentContents:
            'Everyone knows that Reeses Outrageous bars are the best candy',
          documentTitle: 'Opinion for More Candy',
          eventCode: 'ODD',
          signedJudgeName: 'Guy Fieri',
        },
        {
          caseCaption: 'Samson Workman, Petitioner',
          caseId: '2',
          docketNumber: '103-19',
          docketNumberSuffix: 'AAA',
          documentContents: 'KitKats are inferior candies',
          documentTitle: 'Opinion for KitKats',
          eventCode: 'ODD',
          signedJudgeName: 'Guy Fieri',
        },
      ]);
  });

  it('returns an unauthorized error on petitioner user role', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'petitioner',
    });

    await expect(
      opinionAdvancedSearchInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('returns results with an authorized user role (petitionsclerk)', async () => {
    const result = await opinionAdvancedSearchInteractor({
      applicationContext,
      keyword: 'candy',
    });

    expect(result).toMatchObject([
      {
        caseCaption: 'Samson Workman, Petitioner',
        caseId: '1',
        docketNumber: '103-19',
        docketNumberSuffix: 'AAA',
        documentContents:
          'Everyone knows that Reeses Outrageous bars are the best candy',
        documentTitle: 'Opinion for More Candy',
        eventCode: 'ODD',
        signedJudgeName: 'Guy Fieri',
      },
      {
        caseCaption: 'Samson Workman, Petitioner',
        caseId: '2',
        docketNumber: '103-19',
        docketNumberSuffix: 'AAA',
        documentContents: 'KitKats are inferior candies',
        documentTitle: 'Opinion for KitKats',
        eventCode: 'ODD',
        signedJudgeName: 'Guy Fieri',
      },
    ]);
  });

  it('searches for documents that are of type opinions', async () => {
    const keyword = 'keyword';

    await opinionAdvancedSearchInteractor({
      applicationContext,
      keyword,
    });

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      documentEventCodes: Document.OPINION_DOCUMENT_TYPES,
    });
  });
});
