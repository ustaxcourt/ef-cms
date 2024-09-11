import '@web-api/persistence/postgres/messages/mocks.jest';
import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_LOCK } from '../../../../../shared/src/test/mockLock';
import { MOCK_TRIAL_REMOTE } from '../../../../../shared/src/test/mockTrial';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { addCaseToTrialSessionInteractor } from './addCaseToTrialSessionInteractor';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

describe('addCaseToTrialSessionInteractor', () => {
  let mockTrialSession;
  let mockCase;
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => mockTrialSession);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => mockCase);
  });

  beforeEach(() => {
    mockLock = undefined;
    mockTrialSession = MOCK_TRIAL_REMOTE;
    mockCase = MOCK_CASE;
  });

  it('throws an Unauthorized error if the user role is not allowed to access the method', async () => {
    await expect(
      addCaseToTrialSessionInteractor(
        applicationContext,
        {
          calendarNotes: 'testing',
          docketNumber: mockCase.docketNumber,
          trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId!,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('throws an error if the case is already calendared', async () => {
    mockCase = {
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.calendared,
    };

    await expect(
      addCaseToTrialSessionInteractor(
        applicationContext,
        {
          calendarNotes: 'testing',
          docketNumber: mockCase.docketNumber,
          trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId!,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('The case is already calendared');
  });

  it('throws an error if the case is already part of the trial session', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REMOTE,
      caseOrder: [{ docketNumber: MOCK_CASE.docketNumber }],
      isCalendared: true,
    };

    await expect(
      addCaseToTrialSessionInteractor(
        applicationContext,
        {
          calendarNotes: 'testing',
          docketNumber: MOCK_CASE.docketNumber,
          trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId!,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('The case is already part of this trial session.');
  });

  it('should return the expected case with new trial session information', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REMOTE,
      caseOrder: [{ docketNumber: '123-45' }],
      isCalendared: true,
    };

    const latestCase = await addCaseToTrialSessionInteractor(
      applicationContext,
      {
        calendarNotes: 'testing',
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: mockTrialSession.trialSessionId,
      },
      mockPetitionsClerkUser,
    );

    expect(latestCase).toMatchObject({
      associatedJudge: CHIEF_JUDGE,
      status: CASE_STATUS_TYPES.calendared,
      trialDate: '2025-12-01T00:00:00.000Z',
      trialLocation: 'Birmingham, Alabama',
      trialSessionId: mockTrialSession.trialSessionId,
      trialTime: '10:00',
    });
  });

  it('should add calendarNotes for the case to the trial session', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REMOTE,
      caseOrder: [{ docketNumber: '123-45' }],
      isCalendared: true,
    };

    await addCaseToTrialSessionInteractor(
      applicationContext,
      {
        calendarNotes: 'Test',
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId!,
      },
      mockPetitionsClerkUser,
    );

    const caseWithCalendarNotes = applicationContext
      .getPersistenceGateway()
      .updateTrialSession.mock.calls[0][0].trialSessionToUpdate.caseOrder.find(
        c => c.docketNumber === MOCK_CASE.docketNumber,
      );
    expect(caseWithCalendarNotes.calendarNotes).toBe('Test');
  });

  it('sets work items to high priority if the trial session is calendared', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REMOTE,
      caseOrder: [{ docketNumber: '123-45' }],
      isCalendared: true,
    };

    await addCaseToTrialSessionInteractor(
      applicationContext,
      {
        calendarNotes: 'testing',
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId!,
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems.mock
        .calls[0][0],
    ).toMatchObject({
      highPriority: true,
      trialDate: '2025-12-01T00:00:00.000Z',
    });
  });

  it('does not set work items to high priority if the trial session is not calendared', async () => {
    mockTrialSession = {
      ...MOCK_TRIAL_REMOTE,
      caseOrder: [{ docketNumber: '123-45' }],
      isCalendared: false,
    };

    await addCaseToTrialSessionInteractor(
      applicationContext,
      {
        calendarNotes: 'testing',
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: MOCK_TRIAL_REMOTE.trialSessionId!,
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().setPriorityOnAllWorkItems,
    ).not.toHaveBeenCalled();
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      addCaseToTrialSessionInteractor(
        applicationContext,
        {
          calendarNotes: 'testing',
          docketNumber: MOCK_CASE.docketNumber,
          trialSessionId: mockTrialSession.trialSessionId,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await addCaseToTrialSessionInteractor(
      applicationContext,
      {
        calendarNotes: 'testing',
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: mockTrialSession.trialSessionId,
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });
});
