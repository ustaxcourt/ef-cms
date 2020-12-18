const {
  OPINION_EVENT_CODES,
  ROLES,
} = require('../../business/entities/EntityConstants');
const {
  opinionAdvancedSearchInteractor,
} = require('./opinionAdvancedSearchInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('opinionAdvancedSearchInteractor', () => {
  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
    });

    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue([
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
      ]);
  });

  it('returns an unauthorized error on petitioner user role', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
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
      startDate: '2001-01-01',
    });

    expect(result).toMatchObject([
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
    ]);
  });

  it('searches for documents that are of type opinions', async () => {
    const keyword = 'keyword';

    await opinionAdvancedSearchInteractor({
      applicationContext,
      keyword,
      startDate: '2001-01-01',
    });

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      documentEventCodes: OPINION_EVENT_CODES,
    });
  });
});
