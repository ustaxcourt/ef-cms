import { state } from 'cerebral';

/**
 * Sets the value of state.form
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const setIrsNoticeFalseAction = ({ store }) => {
  store.set(state.form.irsMonth, '');
  store.set(state.form.irsDay, '');
  store.set(state.form.irsYear, '');
  store.set(state.form.hasVerifiedIrsNotice, false);
};
