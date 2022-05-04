const {
  getFeatureFlagValueInteractor,
} = require('./featureFlag/getFeatureFlagValueProxy');

/**
 * getChiefJudgeNameForSigningInteractor
 *
 * @param {object} applicationContext the application context\
 * @param {object} providers the providers object
 * @returns {Promise<*>} the promise of the api call
 */
exports.getChiefJudgeNameForSigningInteractor = applicationContext =>
  getFeatureFlagValueInteractor(applicationContext, {
    featureFlag: 'chief-judge-name',
  });
