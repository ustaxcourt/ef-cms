import { state } from 'cerebral';

/**
 * sets state.isExpanded to false
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const setDefaultIsExpandedAction = ({ store }) => {
  store.set(state.isExpanded, false);
};
