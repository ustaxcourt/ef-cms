const {
  DEFAULT_PROCEEDING_TYPE,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0016-hearings-proceeding-type');

describe('migrateItems', () => {
  let documentClient;

  const TRIAL_SESSION_ID = 'f08f8666-0f12-4d61-b699-fc495403983a';

  const MOCK_CASE_HEARING = {
    maxCases: 100,
    pk: 'case|105-20',
    sessionType: SESSION_TYPES.motionHearing,
    sk: `hearing|${TRIAL_SESSION_ID}`,
    startDate: '2025-12-01T00:00:00.000Z',
    term: 'Fall',
    termYear: '2025',
    trialLocation: 'Birmingham, Alabama',
    trialSessionId: TRIAL_SESSION_ID,
  };

  beforeEach(() => {
    documentClient = {
      get: () => ({
        promise: async () => ({
          Item: {
            ...MOCK_CASE_HEARING,
            proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
          },
        }),
      }),
    };
  });

  it('should return and not modify records that are NOT case hearing records', async () => {
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

  it('should return and not modify records that are case hearing records with an existing proceedingType', async () => {
    const mockCaseHearingRecord = {
      ...MOCK_CASE_HEARING,
      proceedingType: DEFAULT_PROCEEDING_TYPE,
    };

    const items = [mockCaseHearingRecord];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([mockCaseHearingRecord]);
  });

  it('should migrate case hearing records that do not have an existing proceedingType', async () => {
    const items = [MOCK_CASE_HEARING];

    const results = await migrateItems(items, documentClient);

    expect(results[0]).toMatchObject({
      ...MOCK_CASE_HEARING,
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    });
  });

  it('should throw an error if the trial session record is not found', async () => {
    documentClient = {
      get: () => ({
        promise: async () => ({
          Item: undefined,
        }),
      }),
    };

    const items = [MOCK_CASE_HEARING];

    await expect(migrateItems(items, documentClient)).rejects.toThrow(
      `Trial session with id ${TRIAL_SESSION_ID} not found`,
    );
  });
});
