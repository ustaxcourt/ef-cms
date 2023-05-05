import { ALLOWLIST_FEATURE_FLAGS } from '../business/entities/EntityConstants';

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
    .getFeatureFlagValueInteractor(applicationContext, {
      featureFlag: ALLOWLIST_FEATURE_FLAGS.CHIEF_JUDGE_NAME.key,
    });
