import { PublicUser } from '../../../../../shared/src/business/entities/PublicUser';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { getUsersInSections } from '@web-api/persistence/postgres/users/getUsersInSections';

/**
 * getJudgesForPublicSearchInteractor
 *
 * @returns {object} the list of judges
 */
export const getJudgesForPublicSearchInteractor = async () => {
  const rawJudges = await getUsersInSections({ sections: [ROLES.judge] });

  return PublicUser.validateRawCollection(rawJudges);
};
