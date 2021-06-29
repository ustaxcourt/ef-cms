const { ROLES } = require('../../entities/EntityConstants');

/**
 * getJudgeForUserChambersInteractor - returns the judge user for a given user in a chambers section
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.user the chambers user
 * @returns {User} the judge user for the given chambers user
 */

exports.getJudgeForUserChambersInteractor = async (
  applicationContext,
  { user },
) => {
  let judgeUser;
  if (user.role === ROLES.judge) {
    judgeUser = user;
  } else if (user.role === ROLES.chambers) {
    let chambersSection;
    if (user.section) {
      chambersSection = user.section;
    } else {
      const chamberUser = await applicationContext
        .getUseCases()
        .getUserInteractor(applicationContext);
      chambersSection = chamberUser.section;
    }

    const sectionUsers = await applicationContext
      .getUseCases()
      .getUsersInSectionInteractor(applicationContext, {
        section: chambersSection,
      });

    judgeUser = sectionUsers.find(
      sectionUser => sectionUser.role === ROLES.judge,
    );
  }

  return judgeUser;
};
