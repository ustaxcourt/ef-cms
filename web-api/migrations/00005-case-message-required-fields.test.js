const {
  CASE_STATUS_TYPES,
} = require('../../shared/src/business/entities/EntityConstants');
const { forAllRecords } = require('./utilities');
const { up } = require('./00005-case-message-required-fields');

describe('case messages required fields migration', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let getStub;

  let mockCaseMessageItem;

  beforeEach(() => {
    mockCaseMessageItem = {
      caseId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      createdAt: '2019-01-01T17:29:13.122Z',
      docketNumber: '123-45',
      docketNumberWithSuffix: '123-45S',
      from: 'gg',
      fromSection: 'petitions',
      fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      message: 'hello world',
      pk: 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
      sk: 'message|5a79c990-cc6c-4b99-8fca-8e31f2d9e78a',
      subject: 'hey!',
      to: 'bob',
      toSection: 'petitions',
      toUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    };

    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [mockCaseMessageItem],
      }),
    });

    putStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    getStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          caseCaption: 'Test Person, Petitioner',
          caseId: '3079c990-cc6c-4b99-8fca-8e31f2d9e7a8',
          status: CASE_STATUS_TYPES.new,
        },
      }),
    });

    documentClient = {
      get: getStub,
      put: putStub,
      scan: scanStub,
    };
  });

  it('does not mutate non case message records', async () => {
    mockCaseMessageItem.sk = 'case|3079c990-cc6c-4b99-8fca-8e31f2d9e7a8';

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toHaveBeenCalled();
  });

  it('mutates case message records with missing case status or case title fields', async () => {
    const items = [
      { ...mockCaseMessageItem, caseStatus: 'Foo', caseTitle: 'Bar' },
      { ...mockCaseMessageItem, caseStatus: 'Fooz' },
      { ...mockCaseMessageItem, caseTitle: 'Baz' },
    ];

    documentClient.scan.mockReturnValue({
      promise: async () => ({
        Items: items,
      }),
    });

    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls.length).toEqual(2);
  });
});
