import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { InvalidRequest } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { User } from '@shared/business/entities/User';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

export const getJudgeForUserHelper = async (
  applicationContext: ServerApplicationContext,
  { user }: { user: AuthUser },
): Promise<ExcludeMethods<User>> => {
  const rawUser = await getUserById({ userId: user.userId });

  const userEntity = new User(rawUser);

  if (!userEntity.section) {
    throw new InvalidRequest(
      `User ${user.userId} does not have a specified section`,
    );
  }

  if (userEntity.isJudgeUser()) return userEntity;

  if (userEntity.isChambersUser()) {
    const judgeUser = await applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper({
        section: userEntity.section,
      });

    if (!judgeUser) {
      throw new InvalidRequest(
        `Could not find Judge for Chambers Section ${userEntity.section}`,
      );
    }

    return judgeUser;
  }

  throw new InvalidRequest(
    'Could not get Judge User ID for non Judge or Chambers User',
  );
};
