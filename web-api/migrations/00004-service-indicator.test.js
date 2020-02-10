const { fail } = require('jest');
const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { up } = require('./00004-service-indicator');

describe('service indicator migration', () => {
  let applicationContext;
  let scanStub;
  let putStub;

  beforeEach(() => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [MOCK_CASE],
      }),
    });

    putStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
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

  it('should not throw an error when a case does not have any practitioners', async () => {
    await up(applicationContext.getDocumentClient(), '', forAllRecords).catch(
      () => {
        fail();
      },
    );
  });
});
