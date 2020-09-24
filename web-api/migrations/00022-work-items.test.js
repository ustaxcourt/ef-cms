const {
  DOCKET_SECTION,
} = require('../../shared/src/business/entities/EntityConstants');
const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { omit } = require('lodash');
const { up } = require('./00022-work-items');

describe('work items array to object', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let deleteStub;
  let queryStub;
  let mockItems = [];

  const WORK_ITEM_ID_1 = '03b2c114-c8b7-4643-852c-3364a197ccb2';
  const WORK_ITEM_ID_2 = '766a2c48-2e28-43e7-9652-139b8b06c12a';

  const mockWorkItem = {
    associatedJudge: 'Judge Ashford',
    docketEntry: {},
    docketNumber: MOCK_CASE.docketNumber,
    section: DOCKET_SECTION,
    sentBy: 'Test Docketclerk',
    sentBySection: DOCKET_SECTION,
    workItemId: WORK_ITEM_ID_1,
  };

  const mockDocumentRecord = {
    documentId: '2ffd0350-65a3-4aea-a395-4a9665a05d91',
    documentTitle: 'Answer',
    documentType: 'Answer',
    eventCode: 'A',
    filedBy: 'Test Petitioner',
    isOnDocketRecord: false,
    pk: `case|${MOCK_CASE.docketNumber}`,
    sk: 'document|2ffd0350-65a3-4aea-a395-4a9665a05d91',
    userId: '82d199bd-6d7d-4655-993a-3fe76be43b63',
    workItems: [mockWorkItem],
  };

  const mockCaseRecord = {
    ...MOCK_CASE,
    pk: `case|${MOCK_CASE.docketNumber}`,
    sk: `case|${MOCK_CASE.docketNumber}`,
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

    queryStub = jest.fn().mockReturnValue({
      promise: async () => ({ Items: [mockCaseRecord] }),
    });

    documentClient = {
      delete: deleteStub,
      put: putStub,
      query: queryStub,
      scan: scanStub,
    };
  });

  it('should not modify records that are NOT a document entity', async () => {
    mockItems = [
      {
        pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
        sk: 'message|5a79c990-cc6c-4b99-8fca-8e31f2d9e78a',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should not modify document records that do not have a workItems array and have an isDraft flag', async () => {
    mockItems = [
      { ...mockDocumentRecord, isDraft: false, workItems: undefined },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should not modify document records that have an empty workItems array and have an isDraft flag', async () => {
    mockItems = [{ ...mockDocumentRecord, isDraft: false, workItems: [] }];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should modify document records that have an empty workItems array and do not have an isDraft flag', async () => {
    mockItems = [{ ...mockDocumentRecord, workItems: [] }];

    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item']).toMatchObject({
      ...omit(mockDocumentRecord, 'workItems'),
      isDraft: false,
    });
  });

  it('should modify document records and add a default isDraft flag if the case record is not found', async () => {
    documentClient.query = jest
      .fn()
      .mockReturnValue({ promise: async () => {} });
    mockItems = [{ ...mockDocumentRecord, workItems: [] }];

    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item']).toMatchObject({
      ...omit(mockDocumentRecord, 'workItems'),
      isDraft: false,
    });
  });

  it('should modify document record with isDraft true if document is not archived, not served, and is a stipulated decision', async () => {
    const mockDocument = {
      ...mockDocumentRecord,
      archived: false,
      documentType: 'Stipulated Decision',
    };
    mockItems = [mockDocument];

    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item']).toMatchObject({
      ...omit(mockDocument, 'workItems'),
      isDraft: true,
    });
  });

  it('should modify document record with isDraft true if document is not archived, not served, and is an order that is not on the docket record', async () => {
    const mockDocument = {
      ...mockDocumentRecord,
      archived: false,
      documentType: 'Order',
    };
    mockItems = [mockDocument];

    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item']).toMatchObject({
      ...omit(mockDocument, 'workItems'),
      isDraft: true,
    });
  });

  it('should modify document record with isDraft false and eventCode is in EVENT_CODES_REQUIRING_JUDGE_SIGNATURE', async () => {
    const mockDocument = {
      ...mockDocumentRecord,
      documentType: 'Order of Dismissal',
      eventCode: 'OD',
      isDraft: false,
      signedAt: undefined,
      signedByUserId: undefined,
      signedJudgeName: undefined,
    };
    mockItems = [mockDocument];

    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item']).toMatchObject({
      ...mockDocument,
      documentType: 'Order of Dismissal',
      eventCode: 'OD',
      isDraft: false,
      signedAt: '2020-07-06T17:06:04.552Z',
      signedByUserId: '7b69a8b5-bcc4-4449-8994-08fda8d342e7',
      signedJudgeName: 'Chief Judge',
    });
  });

  it('should modify document record with isDraft false and eventCode is in EVENT_CODES_REQUIRING_JUDGE_SIGNATUREsmf not overwrite', async () => {
    const mockDocument = {
      ...mockDocumentRecord,
      documentType: 'Order of Dismissal',
      eventCode: 'OD',
      isDraft: false,
      signedAt: '2020-08-06T17:06:04.000Z',
      signedByUserId: '7b69a8b5-bcc4-4449-8994-08fda8d342e8',
      signedJudgeName: 'Original Judge',
    };
    mockItems = [mockDocument];

    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item']).toMatchObject({
      ...mockDocument,
      documentType: 'Order of Dismissal',
      eventCode: 'OD',
      isDraft: false,
      signedAt: '2020-08-06T17:06:04.000Z',
      signedByUserId: '7b69a8b5-bcc4-4449-8994-08fda8d342e8',
      signedJudgeName: 'Original Judge',
    });
  });

  it('should modify document record with isDraft false if document is not archived, not served, and is an order that is on the docket record', async () => {
    documentClient.query = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...mockCaseRecord,
          },
        ],
      }),
    });
    const mockDocument = {
      ...mockDocumentRecord,
      archived: false,
      documentType: 'Order',
      isOnDocketRecord: true,
    };
    mockItems = [mockDocument];

    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item']).toMatchObject({
      ...omit(mockDocument, 'workItems'),
      isDraft: false,
    });
  });

  it('should add workItem to a document entity with a workItems array and delete all except the first workItem in the array', async () => {
    mockItems = [
      {
        ...mockDocumentRecord,
        workItems: [
          mockWorkItem,
          { ...mockWorkItem, workItemId: WORK_ITEM_ID_2 },
        ],
      },
    ];

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
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item'].workItem).toMatchObject(
      mockWorkItem,
    );
    expect(deleteStub).not.toBeCalled();
  });
});
