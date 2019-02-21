/**
 * returns a callback function scoped to a section the users in a section
 *
 * @param {string} section the section to fetch users from
 * @returns {Function} a function which should fetch the users in that section
 */
export default ({ section }) =>
  /**
   * get the users in a section
   *
   * @param {Object} providers the providers object
   * @param {Object} providers.applicationContext the cerebral get function used for getting the state.user
   * @returns {Object} the list of users in a section
   */
  async ({ applicationContext }) => {
    const users = await applicationContext
      .getUseCases()
      .queryForUsers({ section, applicationContext });
    return {
      users,
    };
  };
