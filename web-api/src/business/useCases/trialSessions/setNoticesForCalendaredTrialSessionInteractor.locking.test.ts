import '@web-api/persistence/postgres/featureFlag/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_LOCK } from '@shared/test/mockLock';
import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  determineEntitiesToLock,
  
  setNoticesForCalendaredTrialSessionInteractor,
} from './setNoticesForCalendaredTrialSessionInteractor';
import { mockTrialClerkUser } from '@shared/test/mockAuthUsers';

describe('determineEntitiesToLock', () => {
  const trialSessionId = '6805d1ab-18d0-43ec-bafb-654e83405416';
  const mockCases = [
    MOCK_CASE,
    { ...MOCK_CASE, docketNumber: '100-23' },
    { ...MOCK_CASE, docketNumber: '101-23' },
  ];
  let mockParams;

  beforeEach(() => {
    mockParams = {
      trialSessionId,
    };
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue(mockCases);
  });

  it('should lookup the docket numbers for the specified trial session', async () => {
    await determineEntitiesToLock(applicationContext, mockParams);
    expect(
      applicationContext.getPersistenceGateway()
        .getCalendaredCasesForTrialSession,
    ).toHaveBeenCalledWith({
      applicationContext,
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
  ];
  const mockRequest = {
    clientConnectionId: '8916f743-a22d-4946-ab06-57ddcf386912',
    trialSessionId,
  };
  let mockLock;

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionJobStatusForCase.mockReturnValue({
        unfinishedCases: 0,
      });
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);

    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue(mockCases);

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockResolvedValue({
        ...MOCK_TRIAL_REGULAR,
        proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      });
    applicationContext
      .getPersistenceGateway()
      .isFileExists.mockResolvedValue(true);
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionProcessingStatus.mockResolvedValue(undefined);
  });

  describe('is locked', () => {
    beforeEach(() => {
      mockLock = MOCK_LOCK; // locked
    });

    it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
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
    beforeEach(() => {
      mockLock = undefined; // unlocked
    });

    it('should acquire a lock that lasts for 15 minutes', async () => {
      await setNoticesForCalendaredTrialSessionInteractor(
        applicationContext,
        mockRequest,
        mockTrialClerkUser,
      );

      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifier: `case|${MOCK_CASE.docketNumber}`,
        ttl: 900,
      });
    });

    it('should remove the lock', async () => {
      await setNoticesForCalendaredTrialSessionInteractor(
        applicationContext,
        mockRequest,
        mockTrialClerkUser,
      );

      const expectedIdentifiers = mockCases.map(
        aCase => `case|${aCase.docketNumber}`,
      );
      expect(
        applicationContext.getPersistenceGateway().removeLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifiers: expectedIdentifiers,
      });
    });
  });
});
