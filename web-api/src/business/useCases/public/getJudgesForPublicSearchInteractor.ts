import { PublicUser } from '../../../../../shared/src/business/entities/PublicUser';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { getUsersInSection } from '@web-api/persistence/postgres/users/getUsersInSection';

/**
 * getJudgesForPublicSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {object} the list of judges
 */
export const getJudgesForPublicSearchInteractor = async () => {
  const rawJudges = await getUsersInSection({
    section: ROLES.judge,
  });

  return PublicUser.validateRawCollection(rawJudges);
};
