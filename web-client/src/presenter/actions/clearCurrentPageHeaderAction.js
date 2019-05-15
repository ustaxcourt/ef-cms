import { state } from 'cerebral';

/**
 * sets state.currentPageHeader to ''
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.props the cerebral props object used for getting the props.path
 * @param {Function} providers.store the cerebral store used for setting state.path
 */
export const clearCurrentPageHeaderAction = ({ store }) => {
  store.set(state.currentPageHeader, '');
};
