import { state } from 'cerebral';

/**
 * sets the advanced search props passed in via the query string onto the state.form
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @param {Function} providers.store the cerebral store function
 */
export const setAdvancedSearchPropsOnFormAction = ({ props, store }) => {
  [
    'petitionerName',
    'petitionerState',
    'countryType',
    'yearFiledMin',
    'yearFiledMax',
  ].forEach(field => {
    if (props[field]) {
      store.set(state.advancedSearchForm[field], props[field]);
    }
  });
};
