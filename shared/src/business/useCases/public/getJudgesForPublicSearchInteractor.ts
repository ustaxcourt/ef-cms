import { PublicUser, RawPublicUser } from '../../entities/PublicUser';
import { ROLES } from '../../entities/EntityConstants';

export const getJudgesForPublicSearchInteractor = async (
  applicationContext: IApplicationContext,
): Promise<RawPublicUser[]> => {
  const rawJudges = await applicationContext
    .getPersistenceGateway()
    .getUsersInSection({
      applicationContext,
      section: ROLES.judge,
    });

  return PublicUser.validateRawCollection(rawJudges, { applicationContext });
};
