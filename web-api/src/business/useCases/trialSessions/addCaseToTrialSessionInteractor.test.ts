import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_REMOTE } from '@shared/test/mockTrial';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { addCaseToTrialSessionInteractor } from './addCaseToTrialSessionInteractor';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { setPriorityOnAllWorkItems as setPriorityOnAllWorkItemsMock } from '@web-api/persistence/postgres/workitems/setPriorityOnAllWorkItems';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { tryGetLock as tryGetLockMock } from '@web-api/persistence/postgres/utils/operation/tryGetLock';
import { releaseLock as releaseLockMock } from '@web-api/persistence/postgres/utils/operation/releaseLock';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';

describe('addCaseToTrialSessionInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  jest
    .mocked(updateCaseAndAssociationsMock)
    .mockImplementation(({ caseToUpdate }) => Promise.resolve(caseToUpdate));
  const setPriorityOnAllWorkItems = setPriorityOnAllWorkItemsMock as jest.Mock;
  const tryGetLock = jest.mocked(tryGetLockMock);
  const releaseLock = jest.mocked(releaseLockMock);

  let mockTrialSession;
  let mockCase;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockImplementation(() => mockTrialSession);
    getCaseByDocketNumber.mockImplementation(() => mockCase);
  });

  beforeEach(() => {
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

    expect(setPriorityOnAllWorkItems.mock.calls[0][0]).toMatchObject({
      highPriority: true,
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

    expect(setPriorityOnAllWorkItems).not.toHaveBeenCalled();
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    tryGetLock.mockResolvedValueOnce(false);

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

    expect(tryGetLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );

    expect(releaseLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );
  });
});
