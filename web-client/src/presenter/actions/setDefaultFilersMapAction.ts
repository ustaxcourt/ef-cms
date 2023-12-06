import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.form.filersMap to empty object
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.form.filersMap
 */
export const setDefaultFilersMapAction = ({ store }: ActionProps) => {
  store.set(state.form.filersMap, {});
};
