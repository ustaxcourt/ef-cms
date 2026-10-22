import '@web-api/persistence/postgres/utils/mocks.jest';
import '@web-api/persistence/postgres/trialSessions/mocks.jest';
jest.mock(
  '@web-api/business/useCases/trialSessions/updateTrialSessionInteractorHelper',
);
jest.mock('@web-api/notifications/sendNotificationToUser');
jest.mock('@web-api/persistence/postgres/featureFlag/getFeatureFlagValue');
import { getFeatureFlagValue } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValue';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { updateTrialSession as updateTrialSessionMock } from '@web-api/persistence/postgres/trialSessions/updateTrialSession';
import {
  createWorkingCopyForNewUserOnSession,
  updateCasesAndSetNoticeOfChange,
} from './updateTrialSessionInteractorHelper';
import {
  determineEntitiesToLock,
  updateTrialSession,
} from './updateTrialSessionInteractor';
import { MOCK_TRIAL_INPERSON } from '@shared/test/mockTrial';
import {
  RawTrialSession,
  TrialSession,
} from '@shared/business/entities/trialSessions/TrialSession';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockCaseServicesSupervisorUser } from '@shared/test/mockAuthUsers';
import {
  calculateISODate,
  createISODateString,
} from '@shared/business/utilities/DateHandler';
import { getUniqueId } from '@shared/sharedAppContext';

describe('updateTrialSession Reporting', () => {
  it('locks the former swing partner before unlinking a Reporting conversion', async () => {
    const linkedId = '208a959f-9526-4db5-b262-e58c476a4604';
    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_INPERSON,
      caseOrder: [],
      swingSessionId: linkedId,
    });
    const result = await determineEntitiesToLock(applicationContext, {
      trialSession: new TrialSession({
        ...MOCK_TRIAL_INPERSON,
        proceedingType: 'Reporting',
      }),
    });
    expect(result.identifiers).toEqual([
      `trial-session|${MOCK_TRIAL_INPERSON.trialSessionId}`,
      `trial-session|${linkedId}`,
    ]);
  });
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  const updateTrialSessionMocked = jest.mocked(updateTrialSessionMock);
  const TEST_CLIENT_CONNECTION_ID = 'reporting-connection';
  const TEST_FILE_GUID = getUniqueId();
  const tomorrow = calculateISODate({
    dateString: createISODateString(),
    howMuch: 1,
    units: 'days',
  });
  it('rejects changing an existing trial calendar into Reporting', async () => {
    const current = {
      ...MOCK_TRIAL_INPERSON,
      isCalendared: true,
      startDate: tomorrow,
    };
    getTrialSessionById.mockResolvedValue(current);
    const reporting: RawTrialSession = {
      ...current,
      proceedingType: 'Reporting',
      address1: undefined,
      city: undefined,
      state: undefined,
      postalCode: undefined,
      startTime: undefined,
      estimatedEndDate: tomorrow,
    };
    await expect(
      updateTrialSession(
        applicationContext,
        {
          trialSession: reporting,
          clientConnectionId: TEST_CLIENT_CONNECTION_ID,
        },
        mockCaseServicesSupervisorUser,
      ),
    ).rejects.toThrow(
      'A session with a trial calendar cannot be changed to Reporting.',
    );
    expect(updateTrialSessionMocked).not.toHaveBeenCalled();
  });
  it('gates conversion to Reporting when the flag is disabled', async () => {
    jest.mocked(getFeatureFlagValue).mockResolvedValue(false);
    const current = {
      ...MOCK_TRIAL_INPERSON,
      startDate: tomorrow,
      caseOrder: [],
    };
    getTrialSessionById.mockResolvedValue(current);
    const reporting: RawTrialSession = {
      ...current,
      proceedingType: 'Reporting',
      address1: undefined,
      city: undefined,
      state: undefined,
      postalCode: undefined,
      startTime: undefined,
      estimatedEndDate: tomorrow,
    };
    const result = updateTrialSession(
      applicationContext,
      {
        trialSession: reporting,
        clientConnectionId: TEST_CLIENT_CONNECTION_ID,
      },
      mockCaseServicesSupervisorUser,
    );
    await expect(result).rejects.toThrow(
      'Reporting calendars are not enabled.',
    );
    expect(updateTrialSessionMocked).not.toHaveBeenCalled();
  });

  it('edits an existing Reporting session even when creation is disabled', async () => {
    jest.mocked(getFeatureFlagValue).mockResolvedValue(false);
    const reporting: RawTrialSession = {
      ...MOCK_TRIAL_INPERSON,
      caseOrder: [],
      startDate: tomorrow,
      estimatedEndDate: tomorrow,
      proceedingType: 'Reporting',
      address1: undefined,
      city: undefined,
      state: undefined,
      postalCode: undefined,
      startTime: undefined,
    };
    getTrialSessionById.mockResolvedValue(reporting);
    await updateTrialSession(
      applicationContext,
      {
        trialSession: {
          ...reporting,
          irsCalendarAdministratorInfo: {
            name: 'Calendar Admin',
            email: 'calendar@example.com',
            phone: '2025550100',
          },
        },
        clientConnectionId: TEST_CLIENT_CONNECTION_ID,
      },
      mockCaseServicesSupervisorUser,
    );
    expect(getFeatureFlagValue).not.toHaveBeenCalled();
    expect(updateTrialSessionMocked).toHaveBeenCalledWith({
      trialSessionToUpdate: expect.objectContaining({
        proceedingType: 'Reporting',
        irsCalendarAdministratorInfo: {
          name: 'Calendar Admin',
          email: 'calendar@example.com',
          phone: '2025550100',
        },
      }),
    });
  });

  it('rejects invalid Reporting edits before saving associated entities', async () => {
    const reporting: RawTrialSession = {
      ...MOCK_TRIAL_INPERSON,
      startDate: tomorrow,
      proceedingType: 'Reporting',
      address1: undefined,
      city: undefined,
      state: undefined,
      postalCode: undefined,
      startTime: undefined,
      estimatedEndDate: undefined,
    };
    getTrialSessionById.mockResolvedValue(reporting);
    await expect(
      updateTrialSession(
        applicationContext,
        {
          trialSession: reporting,
          clientConnectionId: TEST_CLIENT_CONNECTION_ID,
        },
        mockCaseServicesSupervisorUser,
      ),
    ).rejects.toThrow('End date must be the same');
    expect(updateTrialSessionMocked).not.toHaveBeenCalled();
    expect(createWorkingCopyForNewUserOnSession).not.toHaveBeenCalled();
    expect(updateCasesAndSetNoticeOfChange).not.toHaveBeenCalled();
  });

  it.each(['reciprocal', 'unrelated', 'missing'])(
    'removes a former reciprocal swing association when converting to Reporting (%s)',
    association => {
      jest.mocked(getFeatureFlagValue).mockResolvedValue(true);
      const linkedId = '208a959f-9526-4db5-b262-e58c476a4604';
      const current: RawTrialSession = {
        ...MOCK_TRIAL_INPERSON,
        startDate: tomorrow,
        caseOrder: [],
        swingSession: true,
        swingSessionId: linkedId,
      };
      const linked: RawTrialSession = {
        ...MOCK_TRIAL_INPERSON,
        trialSessionId: linkedId,
        swingSessionId:
          association === 'reciprocal'
            ? current.trialSessionId
            : TEST_FILE_GUID,
        swingSession: true,
      };
      getTrialSessionById
        .mockResolvedValueOnce(current)
        .mockResolvedValueOnce(association === 'missing' ? undefined : linked);
      const reporting: RawTrialSession = {
        ...current,
        proceedingType: 'Reporting',
        address1: undefined,
        city: undefined,
        state: undefined,
        postalCode: undefined,
        startTime: undefined,
        estimatedEndDate: tomorrow,
        swingSession: undefined,
        swingSessionId: undefined,
      };
      return updateTrialSession(
        applicationContext,
        {
          trialSession: reporting,
          clientConnectionId: TEST_CLIENT_CONNECTION_ID,
        },
        mockCaseServicesSupervisorUser,
      ).then(() => {
        expect(updateTrialSessionMocked).toHaveBeenCalledTimes(
          association === 'reciprocal' ? 2 : 1,
        );
        const expectedIds =
          association === 'reciprocal'
            ? [linkedId, current.trialSessionId]
            : [current.trialSessionId];
        expect(
          updateTrialSessionMocked.mock.calls.map(
            ([args]) => args.trialSessionToUpdate.trialSessionId,
          ),
        ).toEqual(expectedIds);
        expect(
          updateTrialSessionMocked.mock.calls.every(
            ([args]) =>
              !args.trialSessionToUpdate.swingSession &&
              !args.trialSessionToUpdate.swingSessionId,
          ),
        ).toBe(true);
      });
    },
  );
});
