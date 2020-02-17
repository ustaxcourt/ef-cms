const {
  createTrialSessionInteractor,
} = require('./createTrialSessionInteractor');
const { User } = require('../../entities/User');

const MOCK_TRIAL = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2025-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, Alabama',
};

describe('createTrialSessionInteractor', () => {
  let applicationContext;
  let createTrialSessionWorkingCopyMock;
  let createTrialSessionMock;

  beforeEach(() => {
    createTrialSessionMock = jest.fn(trial => trial.trialSession);
    createTrialSessionWorkingCopyMock = jest.fn(() => null);

    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: User.ROLES.docketClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        createTrialSession: createTrialSessionMock,
        createTrialSessionWorkingCopy: createTrialSessionWorkingCopyMock,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
  });

  it('throws error if user is unauthorized', async () => {
    applicationContext.getCurrentUser = () => {
      return new User({
        role: User.ROLES.petitioner,
        userId: 'petitioner',
      });
    };

    await expect(
      createTrialSessionInteractor({
        applicationContext,
        trialSession: MOCK_TRIAL,
      }),
    ).rejects.toThrow();
  });

  it('throws an exception when it fails to create a trial session', async () => {
    createTrialSessionMock = () => {
      throw new Error('Error!');
    };

    let error;

    try {
      await createTrialSessionInteractor({
        applicationContext,
        trialSession: MOCK_TRIAL,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it('creates a trial session successfully', async () => {
    await createTrialSessionInteractor({
      applicationContext,
      trialSession: MOCK_TRIAL,
    });

    expect(createTrialSessionMock).toHaveBeenCalled();
  });

  it('creates a trial session and working copy successfully if a judge is set on the trial session', async () => {
    await createTrialSessionInteractor({
      applicationContext,
      trialSession: {
        ...MOCK_TRIAL,
        judge: { userId: 'c7d90c05-f6cd-442c-a168-202db587f16f' },
      },
    });

    expect(createTrialSessionMock).toHaveBeenCalled();
    expect(createTrialSessionWorkingCopyMock).toHaveBeenCalled();
  });

  it('creates a trial session and working copy successfully if a trial clerk is set on the trial session', async () => {
    await createTrialSessionInteractor({
      applicationContext,
      trialSession: {
        ...MOCK_TRIAL,
        trialClerk: { userId: 'c7d90c05-f6cd-442c-a168-202db587f16f' },
      },
    });

    expect(createTrialSessionMock).toHaveBeenCalled();
    expect(createTrialSessionWorkingCopyMock).toHaveBeenCalled();
  });

  it('creates a working copy for both a trial clerk and judge if both are set on the trial session', async () => {
    await createTrialSessionInteractor({
      applicationContext,
      trialSession: {
        ...MOCK_TRIAL,
        judge: { userId: 'd7d90c05-f6cd-442c-a168-202db587f16f' },
        trialClerk: { userId: 'c7d90c05-f6cd-442c-a168-202db587f16f' },
      },
    });

    expect(createTrialSessionMock).toHaveBeenCalled();
    expect(createTrialSessionWorkingCopyMock).toHaveBeenCalledTimes(2);
  });

  it('sets the trial session as calendared if it is a Motion/Hearing session type', async () => {
    const result = await createTrialSessionInteractor({
      applicationContext,
      trialSession: {
        ...MOCK_TRIAL,
        sessionType: 'Motion/Hearing',
      },
    });

    expect(result.isCalendared).toEqual(true);
  });

  it('sets the trial session as calendared if it is a Special session type', async () => {
    const result = await createTrialSessionInteractor({
      applicationContext,
      trialSession: {
        ...MOCK_TRIAL,
        sessionType: 'Special',
      },
    });

    expect(result.isCalendared).toEqual(true);
  });

  it('does not set the trial session as calendared if it is a Regular session type', async () => {
    const result = await createTrialSessionInteractor({
      applicationContext,
      trialSession: MOCK_TRIAL,
    });

    expect(result.isCalendared).toEqual(false);
  });
});
