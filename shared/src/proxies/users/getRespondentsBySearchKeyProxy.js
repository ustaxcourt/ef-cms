const { post } = require('../requests');

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
  return post({
    applicationContext,
    body: { searchKey },
    endpoint: '/users/respondents',
  });
};
