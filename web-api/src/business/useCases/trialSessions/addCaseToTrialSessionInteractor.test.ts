import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import '@web-api/persistence/postgres/trialSessions/mocks.jest';
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
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import { createOrUpdateTrialSessionCases as createOrUpdateTrialSessionCasesMock } from '@web-api/persistence/postgres/trialSessions/createOrUpdateTrialSessionCases';

describe('addCaseToTrialSessionInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  jest
    .mocked(updateCaseAndAssociationsMock)
    .mockImplementation(({ caseToUpdate }) => Promise.resolve(caseToUpdate));
  const tryGetLocks = jest.mocked(tryGetLocksMock);
  const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
  const createOrUpdateTrialSessionCases = jest.mocked(
    createOrUpdateTrialSessionCasesMock,
  );

  let mockTrialSession;
  let mockCase;

  beforeAll(() => {
    getTrialSessionById.mockImplementation(() => mockTrialSession);
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

    expect(createOrUpdateTrialSessionCases).toHaveBeenCalled();
    const calledBody = createOrUpdateTrialSessionCases.mock.calls[0][0];
    expect(calledBody).toMatchObject({
      trialSessionCases: [
        {
          caseOrder: {
            calendarNotes: 'Test',
            docketNumber: '101-18',
            isHearing: false,
            isManuallyAdded: true,
            removedFromTrial: false,
          },
          docketNumber: '101-18',
          isHearing: false,
          trialSessionId: '48287e71-3754-4017-850d-476a663d1a8e',
        },
      ],
    });
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

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

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    await addCaseToTrialSessionInteractor(
      applicationContext,
      {
        calendarNotes: 'testing',
        docketNumber: MOCK_CASE.docketNumber,
        trialSessionId: mockTrialSession.trialSessionId,
      },
      mockPetitionsClerkUser,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      }),
    );
  });
});
