import { ROLES } from '../entities/EntityConstants';
import { RawUser, User } from '../entities/User';

/**
 * getJudgeInSectionHelper - returns the judge user for a given section
 *
 * @param {object} applicationContext the application context
 * @param {object} obj the options argument
 * @param {string} obj.section the section to fetch the judge from
 * @returns {User} the judge user for the given chambers user
 */

export const getJudgeInSectionHelper = async (
  applicationContext,
  { section },
): Promise<RawUser> => {
  const rawUsers = await applicationContext
    .getPersistenceGateway()
    .getUsersInSection({
      applicationContext,
      section,
    });

  const sectionUsers = User.validateRawCollection(rawUsers, {
    applicationContext,
  });

  const judgeUser = sectionUsers.find(
    sectionUser => sectionUser.role === ROLES.judge,
  );

  return judgeUser!;
};
