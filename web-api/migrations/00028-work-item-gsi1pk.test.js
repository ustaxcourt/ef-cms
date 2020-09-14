const { forAllRecords } = require('./utilities');
const { up } = require('./00028-work-item-gsi1pk');

describe('update work items missing a gsi1pk', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;
  let mockItems = {};

  const workItemToUpdate = {
    associatedJudge: 'Chief Judge',
    docketEntry: {},
    docketNumber: '132-20',
    pk: 'work-item|7fc94df2-9a6a-4aef-b9bb-52d409c4bea3',
    section: 'petitions',
    sentBy: 'Test Petitionsclerk',
    sk: 'work-item|7fc94df2-9a6a-4aef-b9bb-52d409c4bea3',
    updatedAt: '2020-08-12T13:22:10.544Z',
    workItemId: '7fc94df2-9a6a-4aef-b9bb-52d409c4bea3',
  };

  const workItems = [
    {
      associatedJudge: 'Chief Judge',
      docketEntry: {},
      docketNumber: '132-20',
      gsi1pk: 'work-item|1fc94df2-9a6a-4aef-b9bb-52d409c4bea3',
      pk: 'work-item|1fc94df2-9a6a-4aef-b9bb-52d409c4bea3',
      section: 'petitions',
      sentBy: 'Test Petitionsclerk',
      sk: 'work-item|1fc94df2-9a6a-4aef-b9bb-52d409c4bea3',
      updatedAt: '2020-08-12T13:22:10.544Z',
      workItemId: '1fc94df2-9a6a-4aef-b9bb-52d409c4bea3',
    },
    {
      docketNumber: '132-20',
      pk: 'case|99c94df2-9a6a-4aef-b9bb-52d409c4bea3',
      sk: 'case|99c94df2-9a6a-4aef-b9bb-52d409c4bea3',
    },
    {
      docketNumber: '132-20',
      pk: 'case|99c94df2-9a6a-4aef-b9bb-52d409c4bea3',
      sk: 'work-item|7fc94df2-9a6a-4aef-b9bb-52d409c4bea3',
    },
    { ...workItemToUpdate },
  ];

  beforeEach(() => {
    mockItems = [...workItems];
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

    getStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {},
      }),
    });

    documentClient = {
      get: getStub,
      put: putStub,
      scan: scanStub,
    };
  });

  it('only mutates work item records', async () => {
    await up(documentClient, '', forAllRecords);
    const mutatedObject = putStub.mock.calls[0][0]['Item'];

    expect(mutatedObject).toMatchObject({
      ...workItemToUpdate,
      gsi1pk: 'work-item|7fc94df2-9a6a-4aef-b9bb-52d409c4bea3',
    });
  });
});
