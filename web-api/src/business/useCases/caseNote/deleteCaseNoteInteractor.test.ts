import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { MOCK_CASE } from '@shared/test/mockCase';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { deleteCaseNoteInteractor } from './deleteCaseNoteInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { mockJudgeUser } from '@shared/test/mockAuthUsers';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

describe('deleteCaseNoteInteractor', () => {
  let mockUser: AuthUser;

  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  beforeEach(() => {
    mockUser = mockJudgeUser;
  });

  it('should throw an error when the user is not valid or authorized', async () => {
    mockUser = {} as AuthUser;
    let error;
    try {
      await deleteCaseNoteInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockUser,
      );
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
    expect(error).toBeInstanceOf(UnauthorizedError);
  });

  it('should delete a procedural note', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      caseNote: 'My Procedural Note',
    });

    updateCaseAndAssociations.mockImplementation(({ caseToUpdate }) =>
      Promise.resolve(caseToUpdate),
    );
    applicationContext.getUniqueId.mockReturnValue(
      '09c66c94-7480-4915-8f10-2f2e6e0bf4ad',
    );

    let error;
    let result;

    try {
      result = await deleteCaseNoteInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockUser,
      );
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(result).toBeDefined();
    expect(getCaseByDocketNumber).toHaveBeenCalled();
    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(result.caseNote).not.toBeDefined();
  });

  it('should throw a ServiceUnavailableError when the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

    await expect(
      deleteCaseNoteInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    await deleteCaseNoteInteractor(
      applicationContext,
      {
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockUser,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${MOCK_CASE.docketNumber}`],
      }),
    );
  });
});
