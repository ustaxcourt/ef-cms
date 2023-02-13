import { state } from 'cerebral';

/**
 * sets the state.showValidation to true
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.workItem
 */
export const startShowValidationAction = ({ store }) => {
  store.set(state.showValidation, true);
};
