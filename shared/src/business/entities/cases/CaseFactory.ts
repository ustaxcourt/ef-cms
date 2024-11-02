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
  const isAuthorizedUser = isAuthUser(authorizedUser);
  // has permission (whether sealed or not), is public, does not have permission (sealed and not associated with the case)

  if (!isAuthorizedUser) {
    return handleNonAuthUser(rawCase);
  }

  const isSealed = isSealedCase(rawCase);
  const isDirectlyAssociated = userIsDirectlyAssociated({
    aCase: rawCase,
    userId: authorizedUser.userId,
  });
  const isIndirectlyAssociated = isUserPartOfGroup({
    consolidatedCases: rawCase.consolidatedCases || [],
    userId: authorizedUser.userId,
  });

  // Logged in user with permission to see some cases, including this one
  if (isDirectlyAssociated || isIndirectlyAssociated) {
    return new Case(rawCase, { authorizedUser });
  }

  // Logged in user with full case permissions
  if (isAuthorized(authorizedUser, ROLE_PERMISSIONS.GET_ALL_CASES)) {
    return new Case(rawCase, { authorizedUser });
  }

  // Logged in non-internal, non-associated user tries to view non-sealed case
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.GET_ALL_CASES) &&
    !isDirectlyAssociated &&
    !isIndirectlyAssociated
  ) {
    return new PublicCase(rawCase);
  }

  // Logged in non-internal, non-associated user tries to view sealed case
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.GET_ALL_CASES) &&
    !isDirectlyAssociated &&
    !isIndirectlyAssociated &&
    isSealed
  ) {
    return new NoLookyLookyCase(rawCase);
  }

  return new PublicCase(rawCase);
}

function handleNonAuthUser(rawCase: RawCase) {
  const isSealed = isSealedCase(rawCase);
  // Public user viewing sealed case
  if (isSealed) {
    return new NoLookyLookyCase(rawCase);
  }
  return new PublicCase(rawCase);
}
