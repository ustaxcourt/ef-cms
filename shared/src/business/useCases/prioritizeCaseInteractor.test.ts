jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { CASE_STATUS_TYPES } from '../entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { prioritizeCaseInteractor } from './prioritizeCaseInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

describe('prioritizeCaseInteractor', () => {
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  jest
    .mocked(updateCaseAndAssociationsMock)
    .mockImplementation(({ caseToUpdate }) => Promise.resolve(caseToUpdate));
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  it('should update the case with the highPriority flag set as true and attach a reason', async () => {
    getCaseByDocketNumber.mockReturnValue(
      Promise.resolve({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
      }),
    );

    const result = await prioritizeCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        reason: 'just because',
      },
      mockPetitionsClerkUser,
    );

    expect(result).toMatchObject({
      highPriority: true,
      highPriorityReason: 'just because',
    });
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords.mock.calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
  });

  it('should update trial sort mapping records when status is other than "General Docket - At Issue (Ready for Trial)"', async () => {
    getCaseByDocketNumber.mockReturnValue(
      Promise.resolve({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.rule155,
      }),
    );

    await prioritizeCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        reason: 'just because',
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('should throw an unauthorized error if the user has no access to prioritize cases', async () => {
    await expect(
      prioritizeCaseInteractor(
        applicationContext,
        {
          docketNumber: '123-20',
        } as any,
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if the case status is calendared', async () => {
    getCaseByDocketNumber.mockReturnValue(
      Promise.resolve({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.calendared,
      }),
    );

    await expect(
      prioritizeCaseInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          reason: 'just because',
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('Cannot set a calendared case as high priority');
  });

  it('should throw an error if the case is blocked', async () => {
    getCaseByDocketNumber.mockReturnValue(
      Promise.resolve({
        ...MOCK_CASE,
        blocked: true,
        blockedDate: '2019-08-16T17:29:10.132Z',
        blockedReason: 'something',
      }),
    );

    await expect(
      prioritizeCaseInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          reason: 'just because',
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('Cannot set a blocked case as high priority');
  });

  it('should not call createCaseTrialSortMappingRecords if the case is missing a trial city', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      preferredTrialCity: undefined,
    });

    await prioritizeCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        reason: 'just because',
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
  });

  it('should update trial sort mapping records when automaticBlocked and high priority', async () => {
    getCaseByDocketNumber.mockReturnValue(
      Promise.resolve({
        ...MOCK_CASE,
        automaticBlocked: true,
        automaticBlockedDate: '2019-11-30T09:10:11.000Z',
        automaticBlockedReason: 'Pending Item',
        status: CASE_STATUS_TYPES.rule155,
      }),
    );

    await prioritizeCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        reason: 'just because',
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

    await expect(
      prioritizeCaseInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
          reason: 'just because',
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    await prioritizeCaseInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
        reason: 'just because',
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
