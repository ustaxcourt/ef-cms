const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { up } = require('./00022-work-items');

describe('add docketNumber to user case notes', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let deleteStub;
  let mockItems = [];

  const WORK_ITEM_ID_1 = '03b2c114-c8b7-4643-852c-3364a197ccb2';
  const WORK_ITEM_ID_2 = '766a2c48-2e28-43e7-9652-139b8b06c12a';

  const mockWorkItem = {
    associatedJudge: 'Judge Ashford',
    docketNumber: MOCK_CASE.docketNumber,
    document: {},
    section: 'docket',
    sentBy: 'Test Docketclerk',
    sentBySection: 'docket',
    workItemId: WORK_ITEM_ID_1,
  };

  const mockDocumentRecord = {
    documentId: '2ffd0350-65a3-4aea-a395-4a9665a05d91',
    documentTitle: 'Answer',
    documentType: 'Answer',
    eventCode: 'A',
    filedBy: 'Test Petitioner',
    pk: `case|${MOCK_CASE.docketNumber}`,
    sk: 'document|2ffd0350-65a3-4aea-a395-4a9665a05d91',
    userId: '82d199bd-6d7d-4655-993a-3fe76be43b63',
    workItems: [mockWorkItem, { ...mockWorkItem, workItemId: WORK_ITEM_ID_2 }],
  };

  beforeEach(() => {
    mockItems = [mockDocumentRecord];

    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: mockItems,
      }),
    });

    putStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    deleteStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    documentClient = {
      delete: deleteStub,
      put: putStub,
      scan: scanStub,
    };
  });

  it('should not modify records that are are NOT a document entity', async () => {
    mockItems = [
      {
        pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
        sk: 'message|5a79c990-cc6c-4b99-8fca-8e31f2d9e78a',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should not modify document records that do not have a workItems array', async () => {
    mockItems = [{ ...mockDocumentRecord, workItems: undefined }];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should not modify document records that have an empty workItems array', async () => {
    mockItems = [{ ...mockDocumentRecord, workItems: [] }];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should add workItem to a document entity with a workItems array and delete all except the first workItem in the array', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item'].workItem).toMatchObject(
      mockWorkItem,
    );
    expect(deleteStub.mock.calls.length).toEqual(1);
    expect(deleteStub.mock.calls[0][0]['Key']).toMatchObject({
      pk: `work-item|${WORK_ITEM_ID_2}`,
      sk: `work-item|${WORK_ITEM_ID_2}`,
    });
  });

  it('should add workItem to a document entity with a workItems array and not call delete if there is only one workItem in the array', async () => {
    mockItems = [{ ...mockDocumentRecord, workItems: [mockWorkItem] }];

    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item'].workItem).toMatchObject(
      mockWorkItem,
    );
    expect(deleteStub).not.toBeCalled();
  });
});
