const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { up } = require('./00015-case-pk-sk');

describe('case pk and sk prefix migration', () => {
  let applicationContext;
  let scanStub;
  let putStub;
  let deleteStub;

  beforeEach(() => {
    MOCK_CASE.pk = MOCK_CASE.caseId;
    MOCK_CASE.sk = MOCK_CASE.caseId;

    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [MOCK_CASE],
      }),
    });

    deleteStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    putStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        delete: deleteStub,
        put: putStub,
        scan: scanStub,
      }),
    };
  });

  it('should not update the item when it is not a case', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [{ because: 'not a case' }],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(0);
  });

  it('should make delete and put requests for each case', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [MOCK_CASE, MOCK_CASE],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(2);
    expect(deleteStub.mock.calls.length).toBe(2);
  });
});
