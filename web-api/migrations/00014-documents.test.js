const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { up } = require('./00014-documents');

describe('document refactoring migration', () => {
  let applicationContext;
  let scanStub;
  let putStub;

  beforeEach(() => {
    MOCK_CASE.pk = '3a45813b-8b4d-4a2e-bfc5-729e85c2332c';
    MOCK_CASE.sk = '3a45813b-8b4d-4a2e-bfc5-729e85c2332c';

    scanStub = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Items: [MOCK_CASE],
      }),
    });

    putStub = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
        scan: scanStub,
      }),
    };
  });

  it('should not update the item when it is not a case', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Items: [{ because: 'not a case' }],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(0);
  });

  it('should make put requests for each document item of the case', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Items: [
          {
            ...MOCK_CASE,
            documents: [
              {
                documentId: 'abc-123',
                documentTitle: 'hello world',
              },
              {
                documentId: 'def-321',
                documentTitle: 'yolo',
              },
              {
                documentId: 'def-321',
                documentTitle: 'yolo',
              },
              {
                documentId: 'def-321',
                documentTitle: 'yolo',
              },
            ],
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(5);
  });
});
