const {
  SERVICE_INDICATOR_TYPES,
} = require('../../shared/src/business/entities/cases/CaseConstants');
const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { MOCK_DOCUMENTS } = require('../../shared/src/test/mockDocuments');
const { up } = require('./00005-service-indicator-respondents');

describe('service indicator respondents migration', () => {
  let applicationContext;
  let scanStub;
  let putStub;

  beforeEach(() => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [MOCK_DOCUMENTS[0]],
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

  it('should not update the item when it is not a case', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [MOCK_DOCUMENTS[0]],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(0);
  });

  it('should not throw an error when a case does not have any respondents', async () => {
    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(0);
  });

  it("should update each respondent's service indicator to electronic if one is not already specified", async () => {
    const mockRespondents = [
      {},
      { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER },
    ];
    const expectedRespondents = [
      { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC },
      { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER },
    ];
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...MOCK_CASE,
            respondents: mockRespondents,
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls[0][0].Item.respondents).toEqual(
      expectedRespondents,
    );
  });
});
