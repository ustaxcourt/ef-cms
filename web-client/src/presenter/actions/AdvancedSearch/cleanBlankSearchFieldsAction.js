import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * clears any empty properties on the advanced order search form when the user backspaces the fields.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store setter function
 * @param {Function} providers.get the cerebral get function
 */
export const cleanBlankSearchFieldsAction = ({ get, store }) => {
  const orderSearch = get(state.advancedSearchForm.orderSearch);

  const cleanOrderSearch = Object.keys(orderSearch).reduce((acc, key) => {
    if (isEmpty(orderSearch[key])) {
      delete acc[key];
    } else {
      acc[key] = orderSearch[key];
    }
    return acc;
  }, {});

  store.set(state.advancedSearchForm.orderSearch, cleanOrderSearch);
};
