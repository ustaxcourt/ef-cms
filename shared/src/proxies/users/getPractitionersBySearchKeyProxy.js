const { get } = require('../requests');

/**
 * getPractitionersBySearchKeyProxy
 *
 * @param applicationContext
 * @param searchKey
 * @returns {Promise<*>}
 */
exports.getPractitionersBySearchKeyInteractor = ({
  applicationContext,
  searchKey,
}) => {
  return get({
    applicationContext,
    endpoint: `/users/practitioners/search?searchKey=${searchKey}`,
  });
};
