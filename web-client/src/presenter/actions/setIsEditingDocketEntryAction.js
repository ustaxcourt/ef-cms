import { sortBy } from 'lodash';

/**
 * TODO
 *
 * @param {string} section the section to fetch users from
 * @returns {Function} a function which should fetch the users in that section
 */
export const setIsEditingDocketEntryAction = ({ section }) =>
  /**
   * TODO
   *
   * @param {object} providers the providers object
   * @param {object} providers.applicationContext the cerebral get function used for getting the state.user
   * @returns {object} the list of users in a section
   */
  async ({ applicationContext }) => 

    if (!sectionToGet) {
      const user = applicationContext.getCurrentUser();
      sectionToGet = user.section;
    }
    const users = await applicationContext
      .getUseCases()
      .getUsersInSectionInteractor({
        applicationContext,
        section: sectionToGet,
      });

    return {
      users: sortBy(users, 'name'),
    };
  };
