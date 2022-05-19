const {
  ALLOWLIST_FEATURE_FLAGS,
} = require('../business/entities/EntityConstants');

/**
 * getChiefJudgeNameForSigningInteractor
 *
 * @param {object} applicationContext the application context\
 * @param {object} providers the providers object
 * @returns {Promise<*>} the promise of the api call
 */
exports.getChiefJudgeNameForSigningInteractor = applicationContext =>
  applicationContext
    .getUseCases()
    .getFeatureFlagValueInteractor(applicationContext, {
      featureFlag: ALLOWLIST_FEATURE_FLAGS.CHIEF_JUDGE_NAME.key,
    });
