const {
  MOCK_TRIAL_INPERSON,
} = require('../../../../../shared/src/test/mockTrial');
const {
  TRIAL_SESSION_SCOPE_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0002-session-scope');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let mockTrialSessionItem;

  beforeEach(() => {
    mockTrialSessionItem = {
      ...MOCK_TRIAL_INPERSON,
      pk: `trial-session|${MOCK_TRIAL_INPERSON.trialSessionId}`,
      sk: `trial-session|${MOCK_TRIAL_INPERSON.trialSessionId}`,
    };
  });

  it('should return and not modify records that are NOT trial session records', async () => {
    const items = [
      {
        noticeOfTrialDate: '2025-04-10T04:00:00.000Z',
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        noticeOfTrialDate: '2025-04-10T04:00:00.000Z',
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'docket-entry|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      },
    ];
    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        noticeOfTrialDate: '2025-04-10T04:00:00.000Z', // field doesn't belong here, but proving it is unmodified
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        noticeOfTrialDate: '2025-04-10T04:00:00.000Z', // field doesn't belong here, but proving it is unmodified
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'docket-entry|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      },
    ]);
  });

  it('should set sessionScope to locationBased if the item does not have one', async () => {
    const items = [
      {
        ...mockTrialSessionItem,
        sessionScope: undefined,
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].sessionScope).toBe(
      TRIAL_SESSION_SCOPE_TYPES.locationBased,
    );
  });

  it('should not set sessionScope if the item is a trial session and has a sessionScope', async () => {
    const items = [
      {
        ...mockTrialSessionItem,
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].sessionScope).toBe(
      TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
    );
  });
});
