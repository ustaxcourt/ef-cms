const { forAllRecords } = require('./utilities');
const { omit } = require('lodash');
const { up } = require('./00026-update-previous-document');

describe('remove invalid fields from previousDocument', () => {
  let documentClient;
  let scanStub;
  let putStub;
  let mockItems = [];

  const validDocument = {
    documentId: 'feb6e9d6-8163-40b0-89ae-5adb158ddd78',
    documentType: 'Answer',
    eventCode: 'A',
    filedBy: 'Test Petitioner',
    judge: 'Chief Judge',
    userId: 'e5c275c9-bd0f-4c96-ba36-5b4136317d0a',
  };

  const mockDocumentRecordWithNestedWorkItems = {
    ...validDocument,
    pk: 'case|101-20',
    previousDocument: {
      workItems: [{ workItemId: '65b29bfb-c2d2-4d3a-be2b-34769ef2155e' }],
    },
    sk: 'document|458d2a4e-b9d7-4f78-a5b0-6d76bf64a092',
  };
  const mockDocumentRecordWithoutNestedWorkItems = {
    ...validDocument,
    pk: 'case|101-20',
    sk: 'document|6d1bfcf3-e881-4062-a256-2e5b6b67bd22',
  };

  beforeEach(() => {
    mockItems = [
      mockDocumentRecordWithNestedWorkItems,
      mockDocumentRecordWithoutNestedWorkItems,
    ];

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

  it('should delete item.previousDocument.workItems and put the updated record', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub).toBeCalledTimes(1);
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      ...mockDocumentRecordWithNestedWorkItems,
      previousDocument: omit(
        mockDocumentRecordWithNestedWorkItems.previousDocument,
        'workItems',
      ),
    });
  });
});
