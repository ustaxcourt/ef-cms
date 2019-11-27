/**
 * takes a different path depending on the number of results
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.path the cerebral path function
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const isOneResultFoundAction = async ({ path, props }) => {
  if (props.searchResults.length === 1) {
    return path.yes();
  } else {
    return path.no();
  }
};
