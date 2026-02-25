import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.form.partiesToWithdrawFromMap to empty object
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.form.partiesToWithdrawFromMap
 */
export const setDefaultPartiesToWithdrawFromMapAction = ({
  store,
}: ActionProps) => {
  store.set(state.form.partiesToWithdrawFromMap, {});
};
