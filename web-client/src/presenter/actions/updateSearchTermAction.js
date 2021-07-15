import { state } from 'cerebral';

/**
 * set the value of state.header.searchTerm on state to the value passed in on props
 *
 * @param {object} providers the providers object
 * @param {object} providers.props props passed through via cerebral
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const updateSearchTermAction = ({ props, store }) => {
  store.set(state.header.searchTerm, props.searchTerm);
};
