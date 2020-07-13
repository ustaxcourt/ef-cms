const {
  CASE_TYPES_MAP,
} = require('../../shared/src/business/entities/EntityConstants');
const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { up } = require('./00002-invalid-statistics');

describe('invalid statistics migration', () => {
  let applicationContext;
  let scanStub;
  let putStub;

  const mockCaseWithKeys = {
    ...MOCK_CASE,
    pk: `case|${MOCK_CASE.caseId}`,
    sk: `case|${MOCK_CASE.caseId}`,
  };

  beforeEach(() => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [mockCaseWithKeys],
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

  it('should wipe out any existing statistics if hasVerifiedIrsNotice is false', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...mockCaseWithKeys,
            caseType: CASE_TYPES_MAP.deficiency,
            hasVerifiedIrsNotice: false,
            statistics: [
              {
                irsDeficiencyAmount: 1,
                irsTotalPenalties: 1,
                year: '2012',
                yearOrPeriod: 'Year',
              },
            ],
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(1);
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      statistics: [],
    });
  });

  it('should wipe out any existing statistics if case is not a deficiency', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...mockCaseWithKeys,
            caseType: CASE_TYPES_MAP.cdp,
            hasVerifiedIrsNotice: true,
            statistics: [
              {
                irsDeficiencyAmount: 1,
                irsTotalPenalties: 1,
                year: '2012',
                yearOrPeriod: 'Year',
              },
            ],
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(1);
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      statistics: [],
    });
  });

  it('should not wipe out any existing statistics if case is not a deficiency and has no statistics', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...mockCaseWithKeys,
            caseType: CASE_TYPES_MAP.cdp,
            hasVerifiedIrsNotice: true,
            statistics: [],
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(0);
  });

  it('should wipe out any existing statistics if case is not a deficiency, has no verified irs notice, and has no statistics', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...mockCaseWithKeys,
            caseType: CASE_TYPES_MAP.cdp,
            hasVerifiedIrsNotice: false,
            statistics: [{ yearOrPeriod: 'Year' }],
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(1);
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      statistics: [],
    });
  });

  it('should not wipe out any existing statistics if deficiency case hasVerifiedIrsNotice is false and has no statistics', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...mockCaseWithKeys,
            caseType: CASE_TYPES_MAP.deficiency,
            hasVerifiedIrsNotice: false,
            statistics: [],
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(0);
  });
});
