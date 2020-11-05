const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  createTrialSessionInteractor,
} = require('./createTrialSessionInteractor');
const { ROLES } = require('../../entities/EntityConstants');
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
  let user;

  beforeEach(() => {
    user = new User({
      name: 'Docket Clerk',
      role: ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockImplementation(() => user);

    applicationContext
      .getUseCaseHelpers()
      .createTrialSessionAndWorkingCopy.mockImplementation(
        trial => trial.trialSessionToAdd,
      );
  });

  it('throws error if user is unauthorized', async () => {
    user = new User({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });

    await expect(
      createTrialSessionInteractor({
        applicationContext,
        trialSession: MOCK_TRIAL,
      }),
    ).rejects.toThrow();
  });

  it('throws an exception when it fails to create a trial session', async () => {
    applicationContext
      .getUseCaseHelpers()
      .createTrialSessionAndWorkingCopy.mockImplementation(() => {
        throw new Error('Error!');
      });

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

    expect(
      applicationContext.getUseCaseHelpers().createTrialSessionAndWorkingCopy,
    ).toHaveBeenCalled();
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
