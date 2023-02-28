import { state } from 'cerebral';

/**
 * sets the state.showValidation to false
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.workItem
 */
export const stopShowValidationAction = ({ store }) => {
  store.set(state.showValidation, false);
};
