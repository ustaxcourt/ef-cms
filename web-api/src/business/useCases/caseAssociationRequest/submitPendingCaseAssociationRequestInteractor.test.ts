import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import {
  mockAdcUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { submitPendingCaseAssociationRequestInteractor } from './submitPendingCaseAssociationRequestInteractor';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { verifyCaseForUser as verifyCaseForUserMock } from '@web-api/persistence/postgres/cases/userOnCase/verifyCaseForUser';
import { verifyPendingCaseForUser as verifyPendingCaseForUserMock } from '@web-api/persistence/postgres/cases/pendingCases/verifyPendingCaseForUser';
import { associateUsersWithCasesPending as associateUsersWithCasesPendingMock } from '@web-api/persistence/postgres/cases/pendingCases/associateUsersWithCasesPending';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

describe('submitPendingCaseAssociationRequest', () => {
  const caseRecord = {
    docketNumber: '123-19',
  };
  const getUserById = jest.mocked(getUserByIdMock);
  const verifyCaseForUser = jest.mocked(verifyCaseForUserMock);
  const verifyPendingCaseForUser = jest.mocked(verifyPendingCaseForUserMock);
  const associateUsersWithCasesPending = jest.mocked(
    associateUsersWithCasesPendingMock,
  );

  it('should throw an error when not authorized', async () => {
    await expect(
      submitPendingCaseAssociationRequestInteractor(
        {
          docketNumber: caseRecord.docketNumber,
        },
        mockAdcUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should not add mapping if already associated', async () => {
    getUserById.mockResolvedValue(mockPrivatePractitionerUser as DbUser);
    verifyCaseForUser.mockResolvedValue(true);

    await submitPendingCaseAssociationRequestInteractor(
      {
        docketNumber: caseRecord.docketNumber,
      },
      mockPrivatePractitionerUser,
    );

    expect(associateUsersWithCasesPending).not.toHaveBeenCalled();
  });

  it('should not add mapping if these is already a pending association', async () => {
    await submitPendingCaseAssociationRequestInteractor(
      {
        docketNumber: caseRecord.docketNumber,
      },
      mockPrivatePractitionerUser,
    );

    expect(associateUsersWithCasesPending).not.toHaveBeenCalled();
  });

  it('should add mapping', async () => {
    verifyCaseForUser.mockResolvedValue(false);
    verifyPendingCaseForUser.mockResolvedValue(false);

    await submitPendingCaseAssociationRequestInteractor(
      {
        docketNumber: caseRecord.docketNumber,
      },
      mockPrivatePractitionerUser,
    );

    expect(associateUsersWithCasesPending).toHaveBeenCalled();
  });
});
