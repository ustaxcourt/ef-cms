const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { up } = require('./00005-service-indicator-respondents');

describe('service indicator respondents migration', () => {
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

  it('should not throw an error when a case does not have any respondents', async () => {
    up(applicationContext.getDocumentClient(), '', forAllRecords).catch(e => {
      expect(e).toBeInstanceOf(TypeError);
    });
  });
});
