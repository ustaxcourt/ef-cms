import {
  Case,
  isSealedCase,
  isUserPartOfGroup,
  userIsDirectlyAssociated,
} from '@shared/business/entities/cases/Case';
import { PublicCase } from '@shared/business/entities/cases/PublicCase';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';

export function CaseFactory({
  authorizedUser,
  rawCase,
}: {
  rawCase: RawCase;
  authorizedUser: UnknownAuthUser;
}) {
  const userIsLoggedIn = isAuthUser(authorizedUser);
  const caseIsSealed = isSealedCase(rawCase);

  // Handling users who are not logged in
  if (!userIsLoggedIn) {
    return caseIsSealed
      ? new NoLookyLookyCase(rawCase)
      : new PublicCase(rawCase);
  }

  // User is logged in and has full permissions to view cases (e.g., an internal court user or IRS Superuser)
  if (isAuthorized(authorizedUser, ROLE_PERMISSIONS.GET_ALL_CASES)) {
    return new Case(rawCase, { authorizedUser });
  }

  const userIsDirectlyAssociatedWithCase = userIsDirectlyAssociated({
    aCase: rawCase,
    userId: authorizedUser.userId,
  });
  const userIsIndirectlyAssociatedWithCase = isUserPartOfGroup({
    consolidatedCases: rawCase.consolidatedCases || [],
    userId: authorizedUser.userId,
  });
  const userIsAssociatedWithCase =
    userIsDirectlyAssociatedWithCase || userIsIndirectlyAssociatedWithCase;

  // User is logged in and associated with the case (e.g., a practitioner or petitioner on the case)
  if (userIsAssociatedWithCase) {
    return new Case(rawCase, { authorizedUser });
  }

  // User is logged in but neither has permissions to view all cases nor is associated with the case
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.GET_ALL_CASES) &&
    !userIsAssociatedWithCase
  ) {
    return caseIsSealed
      ? new NoLookyLookyCase(rawCase)
      : new PublicCase(rawCase);
  }

  return new PublicCase(rawCase);
}
