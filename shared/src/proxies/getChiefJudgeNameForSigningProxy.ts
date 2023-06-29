/**
 * getChiefJudgeNameForSigningInteractor
 *
 * @param {object} applicationContext the application context\
 * @param {object} providers the providers object
 * @returns {Promise<*>} the promise of the api call
 */
export const getChiefJudgeNameForSigningInteractor = applicationContext =>
  applicationContext
    .getUseCases()
    .getAllFeatureFlagsInteractor(applicationContext);
