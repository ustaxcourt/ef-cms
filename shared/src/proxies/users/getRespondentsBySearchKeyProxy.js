const { get } = require('../requests');

/**
 * getRespondentsBySearchKeyProxy
 *
 * @param applicationContext
 * @param searchKey
 * @returns {Promise<*>}
 */
exports.getRespondentsBySearchKeyInteractor = ({
  applicationContext,
  searchKey,
}) => {
  return get({
    applicationContext,
    endpoint: `/users/respondents/search?searchKey=${searchKey}`,
  });
};
