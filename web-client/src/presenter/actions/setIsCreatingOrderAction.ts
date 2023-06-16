import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets isCreatingOrder to true (used for determining success message after signing)
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const setIsCreatingOrderAction = ({ store }: ActionProps) => {
  store.set(state.isCreatingOrder, true);
};
