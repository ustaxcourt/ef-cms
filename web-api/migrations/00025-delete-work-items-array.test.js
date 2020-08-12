const { forAllRecords } = require('./utilities');
const { omit } = require('lodash');
const { up } = require('./00025-delete-work-items-array');

describe('delete work items array', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let deleteStub;
  let mockItems = [];

  const mockDocumentRecordWithWorkItems = {
    pk: 'case|101-20',
    sk: 'document|458d2a4e-b9d7-4f78-a5b0-6d76bf64a092',
    workItems: [{ workItemId: '65b29bfb-c2d2-4d3a-be2b-34769ef2155e' }],
  };
  const mockDocumentRecordWithoutWorkItems = {
    pk: 'case|101-20',
    sk: 'document|6d1bfcf3-e881-4062-a256-2e5b6b67bd22',
    workItem: { workItemId: '77e1dba9-77c9-4358-ac7a-e91b551fa953' },
  };

  beforeEach(() => {
    mockItems = [
      mockDocumentRecordWithWorkItems,
      mockDocumentRecordWithoutWorkItems,
    ];

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

  it('should not modify records that are NOT case document records', async () => {
    mockItems = [
      {
        pk: 'user|a63bd8dd-c7ab-4628-8486-cd4f5a61eed7',
        sk: 'user|a63bd8dd-c7ab-4628-8486-cd4f5a61eed7',
      },
    ];

    await up(documentClient, '', forAllRecords);

    expect(putStub).not.toBeCalled();
  });

  it('should delete item.workItems and put the updated record', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub.mock.calls.length).toEqual(1);
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      ...omit(mockDocumentRecordWithWorkItems, 'workItems'),
    });
  });
});
