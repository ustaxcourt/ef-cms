import { InvalidRequest } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { User } from '@shared/business/entities/User';

export const getJudgeForUserHelper = async (
  applicationContext: ServerApplicationContext,
  { user }: { user: { userId: string } },
): Promise<ExcludeMethods<User>> => {
  const rawUser = await applicationContext.getPersistenceGateway().getUserById({
    applicationContext,
    userId: user.userId,
  });

  const userEntity = new User(rawUser);

  if (userEntity.isJudgeUser()) return userEntity;

  if (userEntity.isChambersUser()) {
    const judgeUser = await applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper(applicationContext, {
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
