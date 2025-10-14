import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { MOCK_CASE } from '@shared/test/mockCase';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { editRemoteStatusInteractor } from './editRemoteStatusInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

describe('editRemoteStatusInteractor', () => {
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  const mockRemoteTrialGrantedDate = '2023-10-14T00:00:00.000Z';

  beforeEach(() => {
    getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
    updateCaseAndAssociations.mockImplementation(
      ({ caseToUpdate }) => caseToUpdate,
    );
  });

  it('should update the case with the remoteTrialGrantedDate when provided by a docket clerk', async () => {
    const caseWithRemoteDate = {
      ...MOCK_CASE,
      remoteTrialGrantedDate: mockRemoteTrialGrantedDate,
    };
    getCaseByDocketNumber.mockResolvedValue(caseWithRemoteDate);

    const result = await editRemoteStatusInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(result).toMatchObject({
      docketNumber: MOCK_CASE.docketNumber,
      remoteTrialGrantedDate: mockRemoteTrialGrantedDate,
    });
  });

  it('should clear the remote trial granted date when it is set to undefined', async () => {
    const caseWithRemoteDate = {
      ...MOCK_CASE,
      remoteTrialGrantedDate: undefined,
    };
    getCaseByDocketNumber.mockResolvedValue(caseWithRemoteDate);

    const result = await editRemoteStatusInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(result).toBeDefined();
    expect(result.remoteTrialGrantedDate).toBeUndefined();
  });

  it('should throw an UnauthorizedError when user does not have EDIT_DOCKET_ENTRY permission', async () => {
    await expect(
      editRemoteStatusInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should throw a ServiceUnavailableError when the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

    await expect(
      editRemoteStatusInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    await editRemoteStatusInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      }),
    );
  });

  it('should call updateCaseAndAssociations with the case entity', async () => {
    await editRemoteStatusInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations).toHaveBeenCalledWith({
      authorizedUser: mockDocketClerkUser,
      caseToUpdate: expect.objectContaining({
        docketNumber: MOCK_CASE.docketNumber,
      }),
    });
  });

  it('should validate and return the updated case', async () => {
    const caseWithRemoteDate = {
      ...MOCK_CASE,
      remoteTrialGrantedDate: mockRemoteTrialGrantedDate,
    };
    getCaseByDocketNumber.mockResolvedValue(caseWithRemoteDate);

    const result = await editRemoteStatusInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(result).toMatchObject({
      docketNumber: MOCK_CASE.docketNumber,
      remoteTrialGrantedDate: mockRemoteTrialGrantedDate,
    });
    expect(result).toHaveProperty('entityName', 'Case');
  });

  it('should handle cases where remoteTrialGrantedDate is undefined', async () => {
    const caseWithoutRemoteDate = {
      ...MOCK_CASE,
      remoteTrialGrantedDate: undefined,
    };
    getCaseByDocketNumber.mockResolvedValue(caseWithoutRemoteDate);

    const result = await editRemoteStatusInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(result).toMatchObject({
      docketNumber: MOCK_CASE.docketNumber,
    });
  });
});
