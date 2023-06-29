import { User } from '../entities/User';

/**
 * returns the userId of who this note should be stored on.  This is mainly
 * used for chambers users since they all share the same user note with the judge
 * of their section.
 *
 * @param {object} applicationContext the application context
 * @param {object} obj the options argument
 * @param {string} obj.userIdMakingRequest the userId who made the request to this interactor
 * @returns {string} the user id this note should be attached to
 */

export const getUserIdForNote = async (
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
