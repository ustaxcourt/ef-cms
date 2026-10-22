import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import '@web-api/persistence/postgres/utils/mocks.jest';
import '@web-api/persistence/postgres/featureFlag/mocks.jest';
import { getFeatureFlagValues } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import {
  SESSION_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { createTrialSessionInteractor } from './createTrialSessionInteractor';
import { mockDocketClerkUser, mockJudgeUser } from '@shared/test/mockAuthUsers';

const MOCK_TRIAL = {
  ...MOCK_TRIAL_REGULAR,
  maxCases: 100,
  sessionType: SESSION_TYPES.regular,
  startDate: '2025-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, Alabama',
};

describe('createTrialSessionInteractor', () => {
  it('rejects creating a pre-calendared Reporting session', async () => {
    await expect(
      createTrialSessionInteractor(
        applicationContext,
        {
          trialSession: {
            ...MOCK_TRIAL,
            proceedingType: 'Reporting',
            isCalendared: true,
          },
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Reporting sessions require a reporting calendar.');
    expect(
      applicationContext.getUseCaseHelpers().createTrialSessionAndWorkingCopy,
    ).not.toHaveBeenCalled();
  });
  it.each([false, undefined])(
    'gates Reporting creation with flag %s',
    async enabled => {
      jest
        .mocked(getFeatureFlagValues)
        .mockResolvedValue(
          enabled === undefined
            ? []
            : [{ name: 'reporting-calendars', value: { current: enabled } }],
        );
      const trialSession: RawTrialSession = {
        ...MOCK_TRIAL,
        proceedingType: 'Reporting',
        startTime: undefined,
        estimatedEndDate: MOCK_TRIAL.startDate,
      };
      const result = createTrialSessionInteractor(
        applicationContext,
        { trialSession },
        mockDocketClerkUser,
      );
      await expect(result).rejects.toThrow(
        'Reporting calendars are not enabled.',
      );
      expect(
        applicationContext.getUseCaseHelpers().createTrialSessionAndWorkingCopy,
      ).not.toHaveBeenCalled();
    },
  );

  it('creates an uncalendared Reporting session when enabled', async () => {
    jest
      .mocked(getFeatureFlagValues)
      .mockResolvedValue([
        { name: 'reporting-calendars', value: { current: true } },
      ]);
    const trialSession: RawTrialSession = {
      ...MOCK_TRIAL,
      proceedingType: 'Reporting',
      startTime: undefined,
      estimatedEndDate: MOCK_TRIAL.startDate,
    };
    await expect(
      createTrialSessionInteractor(
        applicationContext,
        { trialSession },
        mockDocketClerkUser,
      ),
    ).resolves.toMatchObject({
      proceedingType: 'Reporting',
      isCalendared: false,
      startTime: undefined,
    });
    expect(
      applicationContext.getUseCaseHelpers().createTrialSessionAndWorkingCopy,
    ).toHaveBeenCalledWith({
      trialSessionToAdd: expect.objectContaining({
        proceedingType: 'Reporting',
      }),
    });
  });

  it('validates before invoking creation or swing persistence', async () => {
    await expect(
      createTrialSessionInteractor(
        applicationContext,
        { trialSession: { ...MOCK_TRIAL, maxCases: -1 } },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow();
    expect(
      applicationContext.getUseCaseHelpers().createTrialSessionAndWorkingCopy,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().associateSwingTrialSessions,
    ).not.toHaveBeenCalled();
  });
  beforeEach(() => {
    applicationContext.environment.stage = 'local';

    applicationContext
      .getUseCaseHelpers()
      .createTrialSessionAndWorkingCopy.mockImplementation(
        trial => trial.trialSessionToAdd,
      );
  });

  it('should throw an error when user is unauthorized', async () => {
    await expect(
      createTrialSessionInteractor(
        applicationContext,
        {
          trialSession: MOCK_TRIAL as RawTrialSession,
        },
        mockJudgeUser,
      ),
    ).rejects.toThrow();
  });

  it('should throw an exception when an error is thrown while creating a trial session', async () => {
    applicationContext
      .getUseCaseHelpers()
      .createTrialSessionAndWorkingCopy.mockImplementation(() => {
        throw new Error('Error!');
      });

    await expect(
      createTrialSessionInteractor(
        applicationContext,
        {
          trialSession: MOCK_TRIAL as RawTrialSession,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('');
  });

  it('should successfully create a trial session', async () => {
    await createTrialSessionInteractor(
      applicationContext,
      {
        trialSession: MOCK_TRIAL as RawTrialSession,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getUseCaseHelpers().createTrialSessionAndWorkingCopy,
    ).toHaveBeenCalled();
  });

  it('should set the trial session as calendared when it is a Motion/Hearing session type', async () => {
    const result = await createTrialSessionInteractor(
      applicationContext,
      {
        trialSession: {
          ...MOCK_TRIAL,
          sessionType: SESSION_TYPES.motionHearing,
        } as RawTrialSession,
      },
      mockDocketClerkUser,
    );

    expect(result.isCalendared).toEqual(true);
  });

  it(`should set the trial session as calendared when the sessionScope is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, async () => {
    const result = await createTrialSessionInteractor(
      applicationContext,
      {
        trialSession: {
          ...MOCK_TRIAL,
          sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
          sessionType: SESSION_TYPES.hybrid,
        } as RawTrialSession,
      },
      mockDocketClerkUser,
    );

    expect(result.isCalendared).toEqual(true);
  });

  it('should set the trial session as calendared when it is a Special session type', async () => {
    const result = await createTrialSessionInteractor(
      applicationContext,
      {
        trialSession: {
          ...MOCK_TRIAL,
          sessionType: SESSION_TYPES.special,
        } as RawTrialSession,
      },
      mockDocketClerkUser,
    );

    expect(result.isCalendared).toEqual(true);
  });

  it('should associate swing trial sessions when the current trial session has a swing session', async () => {
    await createTrialSessionInteractor(
      applicationContext,
      {
        trialSession: {
          ...MOCK_TRIAL,
          swingSession: true,
          swingSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
        } as RawTrialSession,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getUseCaseHelpers().associateSwingTrialSessions,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().associateSwingTrialSessions.mock
        .calls[0][0].swingSessionId,
    ).toEqual('208a959f-9526-4db5-b262-e58c476a4604');
  });

  it('shoud not set the trial session as calendared when it is a Regular session type', async () => {
    const result = await createTrialSessionInteractor(
      applicationContext,
      {
        trialSession: MOCK_TRIAL as RawTrialSession,
      },
      mockDocketClerkUser,
    );

    expect(result.isCalendared).toEqual(false);
  });
});
