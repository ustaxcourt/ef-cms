import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears state.form.irsDate values and sets state.form.hasVerifiedIrsNotice to false
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const setIrsNoticeFalseAction = ({ store }: ActionProps) => {
  store.set(state.form.irsMonth, '');
  store.set(state.form.irsDay, '');
  store.set(state.form.irsYear, '');
  store.set(state.form.hasVerifiedIrsNotice, false);
};
