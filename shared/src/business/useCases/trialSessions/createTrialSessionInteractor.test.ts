import {
  ROLES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../../entities/EntityConstants';
import { RawTrialSession } from '../../entities/trialSessions/TrialSession';
import { User } from '../../entities/User';
import { applicationContext } from '../../test/createTestApplicationContext';
import { createTrialSessionInteractor } from './createTrialSessionInteractor';

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

  it('should throw an error when user is unauthorized', async () => {
    user = new User({
      role: ROLES.judge,
      userId: 'judge',
    });

    await expect(
      createTrialSessionInteractor(applicationContext, {
        trialSession: MOCK_TRIAL as RawTrialSession,
      }),
    ).rejects.toThrow();
  });

  it('should throw an exception when an error is thrown while creating a trial session', async () => {
    applicationContext
      .getUseCaseHelpers()
      .createTrialSessionAndWorkingCopy.mockImplementation(() => {
        throw new Error('Error!');
      });

    await expect(
      createTrialSessionInteractor(applicationContext, {
        trialSession: MOCK_TRIAL as RawTrialSession,
      }),
    ).rejects.toThrow('');
  });

  it('should successfully create a trial session', async () => {
    await createTrialSessionInteractor(applicationContext, {
      trialSession: MOCK_TRIAL as RawTrialSession,
    });

    expect(
      applicationContext.getUseCaseHelpers().createTrialSessionAndWorkingCopy,
    ).toHaveBeenCalled();
  });

  it('should set the trial session as calendared when it is a Motion/Hearing session type', async () => {
    const result = await createTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...MOCK_TRIAL,
        sessionType: 'Motion/Hearing',
      } as RawTrialSession,
    });

    expect(result.isCalendared).toEqual(true);
  });

  it(`should set the trial session as calendared when the sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, async () => {
    const result = await createTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...MOCK_TRIAL,
        sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
        sessionType: 'Something Else',
      } as RawTrialSession,
    });

    expect(result.isCalendared).toEqual(true);
  });

  it('should set the trial session as calendared when it is a Special session type', async () => {
    const result = await createTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...MOCK_TRIAL,
        sessionType: 'Special',
      } as RawTrialSession,
    });

    expect(result.isCalendared).toEqual(true);
  });

  it('should associate swing trial sessions when the current trial session has a swing session', async () => {
    await createTrialSessionInteractor(applicationContext, {
      trialSession: {
        ...MOCK_TRIAL,
        swingSession: true,
        swingSessionId: '1234',
      } as RawTrialSession,
    });

    expect(
      applicationContext.getUseCaseHelpers().associateSwingTrialSessions,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().associateSwingTrialSessions.mock
        .calls[0][1].swingSessionId,
    ).toEqual('1234');
  });

  it('shoud not set the trial session as calendared when it is a Regular session type', async () => {
    const result = await createTrialSessionInteractor(applicationContext, {
      trialSession: MOCK_TRIAL as RawTrialSession,
    });

    expect(result.isCalendared).toEqual(false);
  });
});
