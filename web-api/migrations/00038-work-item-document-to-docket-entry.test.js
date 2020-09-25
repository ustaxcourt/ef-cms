const { forAllRecords } = require('./utilities');
const { up } = require('./00038-work-item-document-to-docket-entry');

describe('rename work item document object to docketEntry', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let mockItems = {};

  const workItemRecordWithoutDocketEntry = {
    associatedJudge: 'Chief Judge',
    docketNumber: '132-20',
    document: {
      docketEntryId: 'f4631577-b281-4689-8dfe-07fa0bf8fb49',
    },
    gsi1pk: 'work-item|10cec17c-f2f0-4ecd-80cf-d81c229da485',
    pk: 'work-item|10cec17c-f2f0-4ecd-80cf-d81c229da485',
    section: 'petitions',
    sentBy: 'Test Petitionsclerk',
    sk: 'work-item|10cec17c-f2f0-4ecd-80cf-d81c229da485',
    updatedAt: '2020-08-12T13:22:10.544Z',
    workItemId: '10cec17c-f2f0-4ecd-80cf-d81c229da485',
  };
  const workItemRecordWithDocketEntry = {
    associatedJudge: 'Chief Judge',
    docketEntry: {
      docketEntryId: 'f4631577-b281-4689-8dfe-07fa0bf8fb49',
    },
    docketNumber: '132-20',
    gsi1pk: 'work-item|1fc94df2-9a6a-4aef-b9bb-52d409c4bea3',
    pk: 'work-item|1fc94df2-9a6a-4aef-b9bb-52d409c4bea3',
    section: 'petitions',
    sentBy: 'Test Petitionsclerk',
    sk: 'work-item|1fc94df2-9a6a-4aef-b9bb-52d409c4bea3',
    updatedAt: '2020-08-12T13:22:10.544Z',
    workItemId: '1fc94df2-9a6a-4aef-b9bb-52d409c4bea3',
  };

  beforeEach(() => {
    mockItems = [
      workItemRecordWithoutDocketEntry,
      workItemRecordWithDocketEntry,
    ];
  });

  beforeAll(() => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: mockItems,
      }),
    });

    putStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    documentClient = {
      put: putStub,
      scan: scanStub,
    };
  });

  it('should not modify records that are NOT work item records', async () => {
    mockItems = [
      {
        pk: 'user|a63bd8dd-c7ab-4628-8486-cd4f5a61eed7',
        sk: 'user|a63bd8dd-c7ab-4628-8486-cd4f5a61eed7',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should update only work item records that are missing the docketEntry object', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub).toBeCalledTimes(1);
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      ...workItemRecordWithoutDocketEntry,
    });
  });
});
