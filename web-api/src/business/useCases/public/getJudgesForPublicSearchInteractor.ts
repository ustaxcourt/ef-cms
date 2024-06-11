import { PublicUser } from '../../../../../shared/src/business/entities/PublicUser';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';

/**
 * getJudgesForPublicSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {object} the list of judges
 */
export const getJudgesForPublicSearchInteractor = async (
  applicationContext: ServerApplicationContext,
) => {
  const rawJudges = await applicationContext
    .getPersistenceGateway()
    .getUsersInSection({
      applicationContext,
      section: ROLES.judge,
    });

  return PublicUser.validateRawCollection(rawJudges, { applicationContext });
};
