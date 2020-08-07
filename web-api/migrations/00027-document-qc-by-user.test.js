const { forAllRecords } = require('./utilities');
const { omit } = require('lodash');
const { up } = require('./00027-document-qc-by-user');

describe('document qcByUser -> qcByUserId migration', () => {
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

  const qcByUserId = 'a31cdf00-e1c1-40ea-bb52-d8bcd8df2a33';

  const mockDocumentRecordWithQcByUser = {
    ...validDocument,
    pk: 'case|101-20',
    qcByUser: {
      userId: qcByUserId,
    },
    sk: 'document|458d2a4e-b9d7-4f78-a5b0-6d76bf64a092',
  };
  const mockDocumentRecordWithQcByUserWithoutId = {
    ...validDocument,
    pk: 'case|101-20',
    qcByUser: {},
    sk: 'document|458d2a4e-b9d7-4f78-a5b0-6d76bf64a092',
  };
  const mockDocumentRecordWithoutQcByUser = {
    ...validDocument,
    pk: 'case|101-20',
    sk: 'document|6d1bfcf3-e881-4062-a256-2e5b6b67bd22',
  };

  beforeEach(() => {
    mockItems = [
      mockDocumentRecordWithQcByUser,
      mockDocumentRecordWithQcByUserWithoutId,
      mockDocumentRecordWithoutQcByUser,
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

  it('should set qcByUserId to qcByUser.userId if it exists and put the updated record', async () => {
    await up(documentClient, '', forAllRecords);

    expect(putStub).toBeCalledTimes(2);
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      ...omit(mockDocumentRecordWithQcByUser, 'qcByUser'),
      qcByUserId,
    });
    expect(putStub.mock.calls[1][0].Item).toMatchObject({
      ...omit(mockDocumentRecordWithQcByUserWithoutId, 'qcByUser'),
      qcByUserId: undefined,
    });
  });
});
