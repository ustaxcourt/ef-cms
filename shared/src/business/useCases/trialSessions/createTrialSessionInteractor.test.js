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
  trialLocation: 'Birmingham, AL',
};

describe('createTrialSessionInteractor', () => {
  let applicationContext;

  it('throws error if user is unauthorized', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitioner',
          userId: 'petitioner',
        };
      },
      getPersistenceGateway: () => ({
        createTrialSession: () => {},
      }),
    };
    await expect(
      createTrialSessionInteractor({
        applicationContext,
        trialSession: MOCK_TRIAL,
      }),
    ).rejects.toThrow();
  });

  it('throws an exception when it fails to create a trial session', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: 'docketclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        createTrialSession: () => {
          throw new Error('yup');
        },
      }),
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
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: 'docketclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        createTrialSession: () => MOCK_TRIAL,
      }),
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

    expect(error).toBeUndefined();
  });

  it('creates a trial session and working copy successfully if a judge is set on the trial session', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: 'docketclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        createTrialSession: () => MOCK_TRIAL,
        createTrialSessionWorkingCopy: () => null,
      }),
    };

    let error;

    try {
      await createTrialSessionInteractor({
        applicationContext,
        trialSession: {
          ...MOCK_TRIAL,
          judge: { userId: 'c7d90c05-f6cd-442c-a168-202db587f16f' },
        },
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
  });

  it('sets the trial session as calendared if it is a Motion/Hearing session type', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: 'docketclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        createTrialSession: trial => trial,
      }),
    };

    const result = await createTrialSessionInteractor({
      applicationContext,
      trialSession: {
        ...MOCK_TRIAL,
        sessionType: 'Motion/Hearing',
      },
    });

    expect(result.trialSession.isCalendared).toEqual(true);
  });

  it('sets the trial session as calendared if it is a Special session type', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: 'docketclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        createTrialSession: trial => trial,
      }),
    };

    const result = await createTrialSessionInteractor({
      applicationContext,
      trialSession: {
        ...MOCK_TRIAL,
        sessionType: 'Special',
      },
    });

    expect(result.trialSession.isCalendared).toEqual(true);
  });

  it('does not set the trial session as calendared if it is a Regular session type', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: 'docketclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        createTrialSession: trial => trial,
      }),
    };

    const result = await createTrialSessionInteractor({
      applicationContext,
      trialSession: MOCK_TRIAL,
    });

    expect(result.trialSession.isCalendared).toEqual(false);
  });
});
