import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { verifyCaseForUser } from '@web-api/persistence/postgres/users/cases/verifyCaseForUser';
import { verifyPendingCaseForUser } from '@web-api/persistence/postgres/users/cases/verifyPendingCaseForUser';
import { associateUserWithCasePending } from '@web-api/persistence/postgres/users/cases/associateUserWithCasePending';

export const submitPendingCaseAssociationRequestInteractor = async (
  { docketNumber }: { docketNumber: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSOCIATE_SELF_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await getUserById({ userId: authorizedUser.userId });

  const isAssociated = await verifyCaseForUser({
    docketNumber,
    userId: user.userId,
  });

  const isAssociationPending = await verifyPendingCaseForUser({
    docketNumber,
    userId: user.userId,
  });

  if (!isAssociated && !isAssociationPending) {
    await associateUserWithCasePending({
      docketNumber,
      userId: user.userId,
    });
  }
};
