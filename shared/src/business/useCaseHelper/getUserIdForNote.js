const { User } = require('../entities/User');

/**
 * returns the userId of who this note should be stored on.  This is mainly
 * used for chambers users since they all share the same user note with the judge
 * of their section.
 *
 * @param {object} applicationContext the application context
 * @param {object} obj the options argument
 * @param {string} obj.section the section to fetch the judge from
 * @returns {string} the user id this note should be attached to
 */

exports.getUserIdForNote = async (
  applicationContext,
  { userIdMakingRequest },
) => {
  const rawUser = await applicationContext.getPersistenceGateway().getUserById({
    applicationContext,
    userId: userIdMakingRequest,
  });

  const userEntity = new User(rawUser);

  let { userId } = userEntity;

  if (userEntity.isChambersUser()) {
    const judgeUser = await applicationContext
      .getUseCaseHelpers()
      .getJudgeInSectionHelper(applicationContext, {
        section: userEntity.section,
      });
    if (judgeUser) {
      ({ userId } = judgeUser);
    }
  }

  return userId;
};
