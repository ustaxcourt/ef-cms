import { state } from 'cerebral';

/**
 * sets form.inProgress for prospective case entity
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @returns {void}
 */
export const setCaseNotInProgressAction = ({ store }) => {
  store.set(state.form.inProgress, false);
};
