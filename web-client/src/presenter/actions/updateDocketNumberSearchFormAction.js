import { state } from 'cerebral';

/**
 * set state.advancedSearchForm.docketNumberSearch at props.key to the props.value passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.props props passed through via cerebral
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const updateDocketNumberSearchFormAction = ({ props, store }) => {
  store.set(
    state.advancedSearchForm.docketNumberSearch[props.key],
    props.value,
  );
};
