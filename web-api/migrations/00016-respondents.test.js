const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { up } = require('./00016-respondents');

describe('respondents refactoring migration', () => {
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
        stage: 'local',
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

  it('should make put requests for each respondent item of the case', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Items: [
          {
            ...MOCK_CASE,
            respondents: [
              {
                userId: 'abc-123',
              },
              {
                userId: 'def-321',
              },
              {
                userId: 'def-321',
              },
              {
                userId: 'def-321',
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
