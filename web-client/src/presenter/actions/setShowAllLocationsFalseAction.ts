import { state } from 'cerebral';

/**
 * set the value of modal.showAllLocations on state to false
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const setShowAllLocationsFalseAction = ({ store }) => {
  store.set(state.modal.showAllLocations, false);
};
