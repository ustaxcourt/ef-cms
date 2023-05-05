/**
 * calls a proxy to retrieve cases with the passed lead docket number
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
export const getCurrentVersionInteractor = applicationContext => {
  return applicationContext
    .getHttpClient()
    .get('/deployed-date.txt')
    .then(response => {
      return response.data;
    });
};
