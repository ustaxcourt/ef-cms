import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { getUserGateway } from '@web-api/getUserGateway';
import { deactivateUser } from '@web-api/persistence/postgres/users/deactivateUser';
import { getUsersWithSimilarEmails } from '@web-api/business/useCases/automations/automationsHelpers';

export const deactivateUserInteractor = async (
  { email }: { email: string },
  authorizedUser: UnknownAuthUser,
): Promise<string> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DEACTIVATE_USER)) {
    throw new UnauthorizedError(`Unauthorized`);
  }
  const userEmail = email.toLowerCase();

  const similarEmailUsers = await getUsersWithSimilarEmails({
    userEmail,
  });

  if (!similarEmailUsers.length) {
    throw new NotFoundError(
      `Did not find any users with the email address ${email}`,
    );
  }

  const usersToUpdate = similarEmailUsers.filter(u => {
    return u.email === userEmail || isAliasAccount(u.email, userEmail);
  });

  if (!usersToUpdate.length) {
    throw new NotFoundError(
      `Did not find any Court users with the email address ${email}`,
    );
  }

  const perUserUpdates = await Promise.all(
    usersToUpdate.map(async user => {
      const [cognitoRes, persistenceRes] = await Promise.allSettled([
        getUserGateway().disableUser({ email: user.email }),
        deactivateUser({ userId: user.userId }),
      ]);

      if (
        cognitoRes.status === 'rejected' ||
        persistenceRes.status === 'rejected'
      ) {
        const reason =
          (cognitoRes.status === 'rejected' &&
            ((cognitoRes.reason as Error)?.message ??
              String(cognitoRes.reason))) ||
          (persistenceRes.status === 'rejected' &&
            ((persistenceRes.reason as Error)?.message ??
              String(persistenceRes.reason))) ||
          'Unknown error';

        return {
          ok: false,
          line: `ERROR: failed to deactivate (${user.userId}|${user.email}): ${reason}`,
        };
      }

      const section = persistenceRes.value;
      return {
        ok: true,
        line: `INFO: removed (${user.userId}|${user.email}) from ${section}`,
      };
    }),
  );

  const successes = perUserUpdates.filter(o => o.ok).map(o => o.line);
  const failures = perUserUpdates.filter(o => !o.ok).map(o => o.line);

  if (failures.length > 0) {
    throw new Error(
      `One or more deactivations failed:\n${failures.join('\n')}`,
    );
  }

  const response = [
    ...usersToUpdate
      .filter(u => !u.enabled)
      .map(u => `${u.email} is already disabled`),
    ...successes,
  ].join('<br>');

  return response;
};

function isAliasAccount(aliasAccount: string, email: string): boolean {
  const emailUsername = email.split('@')[0];
  const [aliasUsername, aliasDomain] = aliasAccount.split('@');

  return (
    aliasUsername.startsWith(`${emailUsername}+`) &&
    aliasDomain === 'ustaxcourt.gov'
  );
}
