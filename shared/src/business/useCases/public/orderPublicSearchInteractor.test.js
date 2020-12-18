const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  orderPublicSearchInteractor,
} = require('./orderPublicSearchInteractor');
const { ORDER_EVENT_CODES } = require('../../entities/EntityConstants');

describe('orderPublicSearchInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue([
        {
          caseCaption: 'Samson Workman, Petitioner',
          docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
          docketNumber: '103-19',
          documentTitle: 'Order for More Candy',
          eventCode: 'ODD',
          signedJudgeName: 'Guy Fieri',
        },
        {
          caseCaption: 'Samson Workman, Petitioner',
          docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
          docketNumber: '103-19',
          documentTitle: 'Order for KitKats',
          eventCode: 'ODD',
          signedJudgeName: 'Guy Fieri',
        },
      ]);
  });

  it('should only search for order document types', async () => {
    const result = await orderPublicSearchInteractor({
      applicationContext,
      keyword: 'fish',
      startDate: '2001-01-01',
    });

    expect(
      applicationContext.getPersistenceGateway().advancedDocumentSearch.mock
        .calls[0][0],
    ).toMatchObject({
      documentEventCodes: ORDER_EVENT_CODES,
      omitSealed: true,
    });
    expect(result).toMatchObject([
      {
        caseCaption: 'Samson Workman, Petitioner',
        docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
        docketNumber: '103-19',
        documentTitle: 'Order for More Candy',
        eventCode: 'ODD',
        signedJudgeName: 'Guy Fieri',
      },
      {
        caseCaption: 'Samson Workman, Petitioner',
        docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
        docketNumber: '103-19',
        documentTitle: 'Order for KitKats',
        eventCode: 'ODD',
        signedJudgeName: 'Guy Fieri',
      },
    ]);
  });

  it('throws an error if the search results do not validate', async () => {
    applicationContext
      .getPersistenceGateway()
      .advancedDocumentSearch.mockResolvedValue([
        {
          caseCaption: 'Samson Workman, Petitioner',
          docketEntryId: 'c5bee7c0-bd98-4504-890b-b00eb398e547',
          docketNumber: '103-19',
          documentTitle: 'Order for KitKats',
          eventCode: 'ODD',
          numberOfPages: 'green',
          signedJudgeName: 'Guy Fieri',
        },
      ]);
    await expect(
      orderPublicSearchInteractor({
        applicationContext,
        keyword: 'fish',
        startDate: '2001-01-01',
      }),
    ).rejects.toThrow('entity was invalid');
  });

  it('filters out results belonging to sealed cases', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue({ sealedDate: 'some date' });
    const results = await orderPublicSearchInteractor({
      applicationContext,
      keyword: 'fish',
      startDate: '2001-01-01',
    });
    expect(results.length).toBe(0);
  });
});
