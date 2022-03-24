import { sortBy } from 'lodash';
const memoize = require('memoizee');

/**
 * Caches the request for getting the users because users do not change often.
 */
const getUsersInSection = memoize(
  function (applicationContext, section) {
    return applicationContext
      .getUseCases()
      .getUsersInSectionInteractor(applicationContext, {
        section,
      });
  },
  {
    normalizer(args) {
      const section = args[1];
      return section;
    },
  },
);

/**
 * returns a callback function scoped to a section the users in a section
 *
 * @param {string} section the section to fetch users from
 * @returns {Function} a function which should fetch the users in that section
 */
export const getUsersInSectionAction =
  ({ section }) =>
  /**
   * get the users in a section
   *
   * @param {object} providers the providers object
   * @param {object} providers.applicationContext the cerebral get function used for getting the state.user
   * @returns {object} the list of users in a section
   */
  async ({ applicationContext }) => {
    let sectionToGet = section;

    if (!sectionToGet) {
      const user = applicationContext.getCurrentUser();
      sectionToGet = user.section;
    }

    const users = await getUsersInSection(applicationContext, sectionToGet);

    return {
      users: sortBy(users, 'name'),
    };
  };
