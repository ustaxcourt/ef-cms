const {
  CASE_TYPES_MAP,
} = require('../../shared/src/business/entities/EntityConstants');
const { forAllRecords } = require('./utilities');
const { MOCK_CASE } = require('../../shared/src/test/mockCase');
const { up } = require('./00001-statistics');

describe('case statistics migration', () => {
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

  it('should not update the item when it is not a case', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [mockCaseWithKeys],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(0);
  });

  it('should not update the item when its case type is not deficiency', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...mockCaseWithKeys,
            caseType: CASE_TYPES_MAP.cdp,
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(0);
  });

  it('should not update the item when hasVerifiedIrsNotice is false', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...mockCaseWithKeys,
            caseType: CASE_TYPES_MAP.deficiency,
            hasVerifiedIrsNotice: false,
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(0);
  });

  it('should update the item with a default statistic if it does not have one', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...mockCaseWithKeys,
            caseType: CASE_TYPES_MAP.deficiency,
            hasVerifiedIrsNotice: true,
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(1);
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      statistics: [
        {
          irsDeficiencyAmount: 1,
          irsTotalPenalties: 1,
          year: '2012',
          yearOrPeriod: 'Year',
        },
      ],
    });
  });

  it('should update the item with a default statistic if its statistics array is length 0', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...mockCaseWithKeys,
            caseType: CASE_TYPES_MAP.deficiency,
            hasVerifiedIrsNotice: true,
            statistics: [],
          },
        ],
      }),
    });

    await up(applicationContext.getDocumentClient(), '', forAllRecords);

    expect(putStub.mock.calls.length).toBe(1);
    expect(putStub.mock.calls[0][0].Item).toMatchObject({
      statistics: [
        {
          irsDeficiencyAmount: 1,
          irsTotalPenalties: 1,
          year: '2012',
          yearOrPeriod: 'Year',
        },
      ],
    });
  });

  it('should update the item with new statistic values if statistics are already present on the case', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...mockCaseWithKeys,
            caseType: CASE_TYPES_MAP.deficiency,
            hasVerifiedIrsNotice: true,
            statistics: [
              {
                deficiencyAmount: 123,
                totalPenalties: 123,
                year: '2015',
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
      statistics: [
        {
          irsDeficiencyAmount: 123,
          irsTotalPenalties: 123,
          year: '2015',
          yearOrPeriod: 'Year',
        },
      ],
    });
  });

  it('should not change the item if its statistic values are already updated', async () => {
    scanStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [
          {
            ...mockCaseWithKeys,
            caseType: CASE_TYPES_MAP.deficiency,
            hasVerifiedIrsNotice: true,
            statistics: [
              {
                irsDeficiencyAmount: 123,
                irsTotalPenalties: 123,
                year: '2015',
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
      statistics: [
        {
          irsDeficiencyAmount: 123,
          irsTotalPenalties: 123,
          year: '2015',
          yearOrPeriod: 'Year',
        },
      ],
    });
  });
});
