import '@web-api/persistence/postgres/users/mocks.jest';
import {
  mockAdcUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { submitPendingCaseAssociationRequestInteractor } from './submitPendingCaseAssociationRequestInteractor';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { verifyCaseForUser as verifyCaseForUserMock } from '@web-api/persistence/postgres/users/cases/verifyCaseForUser';
import { verifyPendingCaseForUser as verifyPendingCaseForUserMock } from '@web-api/persistence/postgres/users/cases/verifyPendingCaseForUser';
import { associateUserWithCasePending as associateUserWithCasePendingMock } from '@web-api/persistence/postgres/users/cases/associateUserWithCasePending';

const getUserById = getUserByIdMock as jest.Mock;
const verifyCaseForUser = verifyCaseForUserMock as jest.Mock;
const verifyPendingCaseForUser = verifyPendingCaseForUserMock as jest.Mock;
const associateUserWithCasePending =
  associateUserWithCasePendingMock as jest.Mock;

describe('submitPendingCaseAssociationRequest', () => {
  const caseRecord = {
    docketNumber: '123-19',
  };

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
    getUserById.mockReturnValue(mockPrivatePractitionerUser);
    verifyCaseForUser.mockReturnValue(true);

    await submitPendingCaseAssociationRequestInteractor(
      {
        docketNumber: caseRecord.docketNumber,
      },
      mockPrivatePractitionerUser,
    );

    expect(associateUserWithCasePending).not.toHaveBeenCalled();
  });

  it('should not add mapping if these is already a pending association', async () => {
    await submitPendingCaseAssociationRequestInteractor(
      {
        docketNumber: caseRecord.docketNumber,
      },
      mockPrivatePractitionerUser,
    );

    expect(associateUserWithCasePending).not.toHaveBeenCalled();
  });

  it('should add mapping', async () => {
    verifyCaseForUser.mockReturnValue(false);
    verifyPendingCaseForUser.mockReturnValue(false);

    await submitPendingCaseAssociationRequestInteractor(
      {
        docketNumber: caseRecord.docketNumber,
      },
      mockPrivatePractitionerUser,
    );

    expect(associateUserWithCasePending).toHaveBeenCalled();
  });
});
