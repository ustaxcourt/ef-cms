const { User } = require('../entities/User');
/**
 * returns whether the given feature flag is enabled for the current user and environment
 *
 * @param {string} the name of the feature
 * @param {object} the user
 * @param {string} the environment
 * @returns {boolean} whether the feature is enabled
 */

const getIsFeatureEnabled = (featureName, user, env) => {
  const features = {
    advanced_document_search: (() => {
      const isProduction = env === 'prod';
      const isInternalUser = User.isInternalUser(user.role);

      return !isProduction && isInternalUser;
    })(),
  };

  return !!features[featureName];
};

module.exports = {
  getIsFeatureEnabled,
};
