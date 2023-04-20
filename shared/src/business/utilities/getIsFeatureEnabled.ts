import { User } from '../entities/User';
/**
 * returns whether the given feature flag is enabled for the current user and environment
 *
 * @param {string} the name of the feature
 * @param {object} the user
 * @param {string} the environment
 * @returns {boolean} whether the feature is enabled
 */

export const getIsFeatureEnabled = (featureName, user, env) => {
  const features = {
    advanced_opinion_search: (() => {
      const isProduction = env === 'prod';
      const isInternalUser = User.isInternalUser(user.role);

      return !isProduction && isInternalUser;
    })(),
    standalone_remote_session: true,
  };

  return !!features[featureName];
};
