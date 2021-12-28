/**
 * calls a proxy to retrieve cases with the passed lead docket number
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCurrentVersionInteractor = applicationContext => {
  return applicationContext
    .getHttpClient()
    .get('/version.txt')
    .then(response => {
      return response.data;
    });
};
