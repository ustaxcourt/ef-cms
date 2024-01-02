import { ExcludeMethods } from 'types/TEntity';
import { InvalidRequest } from '@web-api/errors/errors';
import { User } from '@shared/business/entities/User';

export type GetJudgeForUser = (
  applicationContext: IApplicationContext,
  { user }: { user: { userId: string } },
) => Promise<ExcludeMethods<User>>;

export const getJudgeForUserHelper: GetJudgeForUser = async (
  applicationContext,
  { user },
) => {
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
