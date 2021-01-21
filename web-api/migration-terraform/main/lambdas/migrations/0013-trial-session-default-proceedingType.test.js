const {
  DEFAULT_PROCEEDING_TYPE,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0013-trial-session-default-proceedingType');

describe('migrateItems', () => {
  const MOCK_TRIAL = {
    maxCases: 100,
    sessionType: 'Regular',
    startDate: '2025-12-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
  };

  it('should return and not modify records that are NOT trial session records', async () => {
    const items = [
      {
        pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual(
      expect.arrayContaining([
        {
          pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
          sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        },
      ]),
    );
  });

  it('should return and not modify records that are case trial session records with an existing proceedingType', async () => {
    const mockTrialSessionRecord = {
      ...MOCK_TRIAL,
      pk: 'trial-session|6d74eadc-0181-4ff5-826c-305200e8733e',
      proceedingType: DEFAULT_PROCEEDING_TYPE,
      sk: 'trial-session|6d74eadc-0181-4ff5-826c-305200e8733e',
    };

    const items = [mockTrialSessionRecord];

    const results = await migrateItems(items);

    expect(results).toEqual([mockTrialSessionRecord]);
  });

  it('should migrate trial session records that do not have an existing proceedingType', async () => {
    const mockTrialSessionRecord = {
      ...MOCK_TRIAL,
      pk: 'trial-session|6d74eadc-0181-4ff5-826c-305200e8733e',
      sk: 'trial-session|6d74eadc-0181-4ff5-826c-305200e8733e',
    };

    const items = [mockTrialSessionRecord];

    const results = await migrateItems(items);

    expect(results[0]).toMatchObject({
      ...mockTrialSessionRecord,
      proceedingType: DEFAULT_PROCEEDING_TYPE,
    });
  });
});
