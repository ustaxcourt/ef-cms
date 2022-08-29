const { PublicUser } = require('../../entities/PublicUser');
const { ROLES } = require('../../entities/EntityConstants');

/**
 * getJudgesForPublicSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {object} the list of judges
 */
exports.getJudgesForPublicSearchInteractor = async applicationContext => {
  const rawJudges = await applicationContext
    .getPersistenceGateway()
    .getUsersInSection({
      applicationContext,
      section: ROLES.judge,
    });

  return PublicUser.validateRawCollection(rawJudges, { applicationContext });
};
