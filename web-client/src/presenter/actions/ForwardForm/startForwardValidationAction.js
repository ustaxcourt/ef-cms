import { state } from 'cerebral';

/**
 * sets the state.workItemMetadata to true to start validation
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.workItemMetadata
 */
export const startForwardValidationAction = ({ store }) => {
  store.set(state.workItemMetadata.showValidation, true);
};
