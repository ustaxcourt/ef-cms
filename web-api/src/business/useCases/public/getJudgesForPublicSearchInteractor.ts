import { PublicUser } from '../../../../../shared/src/business/entities/PublicUser';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';

/**
 * getJudgesForPublicSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {object} the list of judges
 */
export const getJudgesForPublicSearchInteractor = async (
  applicationContext: IApplicationContext,
) => {
  const rawJudges = await applicationContext
    .getPersistenceGateway()
    .getUsersInSection({
      applicationContext,
      section: ROLES.judge,
    });

  return PublicUser.validateRawCollection(rawJudges, { applicationContext });
};
