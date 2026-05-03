import '@web-api/persistence/postgres/utils/mocks.jest';
import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  determineEntitiesToLock,
  setNoticesForCalendaredTrialSessionInteractor,
} from './setNoticesForCalendaredTrialSessionInteractor';
import { mockTrialClerkUser } from '@shared/test/mockAuthUsers';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { getTrialSessionById as getTrialSessionByIdMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionById';
import {
  getCalendaredCasesForTrialSession as getCalendaredCasesForTrialSessionMock,
  RawCaseAndCaseOrder,
} from '@web-api/persistence/postgres/trialSessions/getCalendaredCasesForTrialSession';
import { getTrialSessionNotificationProcessing as getTrialSessionNotificationProcessingMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessionNotificationProcessing';

const tryGetLocks = jest.mocked(tryGetLocksMock);
const getTrialSessionById = jest.mocked(getTrialSessionByIdMock);
const getCalendaredCasesForTrialSession = jest.mocked(
  getCalendaredCasesForTrialSessionMock,
);
const getTrialSessionNotificationProcessing = jest.mocked(
  getTrialSessionNotificationProcessingMock,
);

describe('determineEntitiesToLock', () => {
  const trialSessionId = '6805d1ab-18d0-43ec-bafb-654e83405416';
  const mockCases = [
    MOCK_CASE,
    { ...MOCK_CASE, docketNumber: '100-23' },
    { ...MOCK_CASE, docketNumber: '101-23' },
  ] as unknown as RawCaseAndCaseOrder[];
  let mockParams;

  beforeEach(() => {
    mockParams = {
      trialSessionId,
    };
    getCalendaredCasesForTrialSession.mockResolvedValue(mockCases);
  });

  it('should lookup the docket numbers for the specified trial session', async () => {
    await determineEntitiesToLock(applicationContext, mockParams);
    expect(getCalendaredCasesForTrialSession).toHaveBeenCalledWith({
      trialSessionId,
    });
  });

  it('should return an object that includes all of the docketNumbers associated with the user', async () => {
    const { identifiers } = await determineEntitiesToLock(
      applicationContext,
      mockParams,
    );

    expect(identifiers).toContain(`case|${mockCases[0].docketNumber}`);
    expect(identifiers).toContain(`case|${mockCases[1].docketNumber}`);
    expect(identifiers).toContain(`case|${mockCases[2].docketNumber}`);
  });
});

describe('setNoticesForCalendaredTrialSessionInteractor', () => {
  const trialSessionId = '6805d1ab-18d0-43ec-bafb-654e83405416';
  const mockCases = [
    MOCK_CASE,
    { ...MOCK_CASE, docketNumber: '100-23' },
    { ...MOCK_CASE, docketNumber: '101-23' },
  ] as unknown as RawCaseAndCaseOrder[];
  const mockRequest = {
    clientConnectionId: '8916f743-a22d-4946-ab06-57ddcf386912',
    trialSessionId,
  };

  beforeEach(() => {
    getTrialSessionNotificationProcessing.mockResolvedValue({
      unfinishedCases: 0,
      status: 'complete',
      trialSessionId,
      caseStatuses: {},
    });

    getCalendaredCasesForTrialSession.mockResolvedValue(mockCases);

    getTrialSessionById.mockResolvedValue({
      ...MOCK_TRIAL_REGULAR,
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    });
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValue(true);
  });

  describe('is locked', () => {
    it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
      tryGetLocks.mockResolvedValueOnce([
        { successfullyLocked: false, identifier: 'abc' },
      ]);

      await expect(
        setNoticesForCalendaredTrialSessionInteractor(
          applicationContext,
          mockRequest,
          mockTrialClerkUser,
        ),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getPersistenceGateway().updateCaseAndAssociations,
      ).not.toHaveBeenCalled();
    });
  });

  describe('is not locked', () => {
    it('should acquire locks on the cases', async () => {
      await setNoticesForCalendaredTrialSessionInteractor(
        applicationContext,
        mockRequest,
        mockTrialClerkUser,
      );

      const expectedIdentifiers = mockCases.map(
        aCase => `case|${aCase.docketNumber}`,
      );

      expect(tryGetLocks).toHaveBeenCalledWith(
        expect.objectContaining({
          identifiers: expectedIdentifiers,
        }),
      );
    });
  });
});
