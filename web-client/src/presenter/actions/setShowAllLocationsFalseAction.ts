import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the value of modal.showAllLocations on state to false
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @returns {void}
 */
export const setShowAllLocationsFalseAction = ({ store }: ActionProps) => {
  store.set(state.modal.showAllLocations, false);
};
