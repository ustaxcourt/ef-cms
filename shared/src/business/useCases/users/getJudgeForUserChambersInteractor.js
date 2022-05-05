const { ROLES } = require('../../entities/EntityConstants');

/**
 * getJudgeForUserChambersInteractor - returns the judge user for a given user in a chambers section
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @returns {User} the judge user for the given chambers user
 */

exports.getJudgeForUserChambersInteractor = async applicationContext => {
  const chamberUser = await applicationContext
    .getUseCases()
    .getUserInteractor(applicationContext);
  const chambersSection = chamberUser.section;

  const sectionUsers = await applicationContext
    .getUseCases()
    .getUsersInSectionInteractor(applicationContext, {
      section: chambersSection,
    });

  const judgeUser = sectionUsers.find(
    sectionUser => sectionUser.role === ROLES.judge,
  );

  return judgeUser;
};
