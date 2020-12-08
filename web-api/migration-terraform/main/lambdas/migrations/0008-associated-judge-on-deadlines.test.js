const {
  CASE_STATUS_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0008-associated-judge-on-deadlines');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let documentClient;

  const mockCaseDeadline = {
    associatedJudge: 'Carol Stills',
    caseDeadlineId: '3a18099c-3a44-42da-a8e8-ec8938b753ad',
    createdAt: '2020-03-01T21:42:29.073Z',
    deadlineDate: '2020-03-01T21:42:29.073Z',
    description: 'A test case deadline',
    docketNumber: '999-99',
    pk: 'case-deadline|999-99',
    sk: 'case-deadline|999-99',
  };

  beforeEach(() => {
    documentClient = {
      get: () => ({
        promise: async () => ({
          Items: [],
        }),
      }),
    };
  });

  it('should return and not modify records that are NOT a case deadline', async () => {
    const items = [
      {
        pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        {
          pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
          sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        },
      ]),
    );
  });

  it('should return and NOT modify case deadline records when the case the deadline is associated with is NOT calendared', async () => {
    const items = [mockCaseDeadline];
    documentClient.get = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          ...MOCK_CASE,
          associatedJudge: 'Michael Scott',
          status: CASE_STATUS_TYPES.generalDocket,
        },
      }),
    });

    const results = await migrateItems(items, documentClient);

    expect(results.length).toBe(1);
    expect(results[0].associatedJudge).toBe('Carol Stills');
  });

  it('should set the case deadline associatedJudge to the associatedJudge on the case when they do NOT match and the case is calendared', async () => {
    const items = [mockCaseDeadline];
    documentClient.get = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          ...MOCK_CASE,
          associatedJudge: 'Michael Scott',
          status: CASE_STATUS_TYPES.calendared,
        },
      }),
    });

    const results = await migrateItems(items, documentClient);

    expect(results.length).toBe(1);
    expect(results[0].associatedJudge).toBe('Michael Scott');
  });

  it('should validate the modified case deadline entity', async () => {
    const items = [{ ...mockCaseDeadline, docketNumber: undefined }]; // docketNumber is required on CaseDeadline
    documentClient.get = jest.fn().mockReturnValue({
      promise: async () => ({
        Item: {
          ...MOCK_CASE,
          associatedJudge: 'Michael Scott',
          status: CASE_STATUS_TYPES.calendared,
        },
      }),
    });

    await expect(migrateItems(items, documentClient)).rejects.toThrow('');
  });
});
