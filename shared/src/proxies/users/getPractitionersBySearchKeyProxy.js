const { post } = require('../requests');

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
  return post({
    applicationContext,
    body: { searchKey },
    endpoint: '/users/practitioners',
  });
};
