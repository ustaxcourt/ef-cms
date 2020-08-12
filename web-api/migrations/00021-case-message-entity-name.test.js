const {
  DOCKET_SECTION,
} = require('../../shared/src/business/entities/EntityConstants');
const { forAllRecords } = require('./utilities');
const { up } = require('./00021-case-message-entity-name');

describe('update case message entity name on message records', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;
  let mockItems = {};

  const messages = [
    {
      attachments: [
        {
          documentId: 'af9e2d43-1255-4e3d-80d0-63f0aedfab5a',
          documentTitle: 'Petition',
        },
      ],
      caseStatus: 'General Docket - Not at Issue',
      caseTitle: 'Astra Santiago',
      createdAt: '2020-07-31T19:29:05.551Z',
      docketNumber: '105-20',
      docketNumberWithSuffix: '105-20L',
      entityName: 'CaseMessage',
      from: 'Test Docketclerk1',
      fromSection: DOCKET_SECTION,
      fromUserId: '2805d1ab-18d0-43ec-bafb-654e83405416',
      gsi1pk: 'message|fd9d04b5-26ff-4416-9648-967f135e16ef',
      isCompleted: false,
      isRepliedTo: false,
      message: 'asdssa',
      messageId: 'fd9d04b5-26ff-4416-9648-967f135e16ef',
      parentMessageId: 'fd9d04b5-26ff-4416-9648-967f135e16ef',
      pk: 'case|105-20',
      sk: 'message|fd9d04b5-26ff-4416-9648-967f135e16ef',
      subject: 'Petition',
      to: 'Test Docketclerk1',
      toSection: DOCKET_SECTION,
      toUserId: '2805d1ab-18d0-43ec-bafb-654e83405416',
    },
  ];

  beforeEach(() => {
    mockItems = [...messages];
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

  it('updates the entity name to Message for message records', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls[0][0]['Item'].entityName).toEqual('Message');
  });
});
