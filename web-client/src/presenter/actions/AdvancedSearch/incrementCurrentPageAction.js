import { state } from 'cerebral';

/**
 * sets the advanced search props passed in via the query string onto the state.form
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {Function} providers.store the cerebral store function
 */
export const incrementCurrentPageAction = ({ get, store }) => {
  let currentPage = get(state.form.currentPage);

  store.set(state.form.currentPage, currentPage + 1);
};
