import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.selectedWorkItems to an empty list
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearSelectedWorkItemsAction = ({ store }: ActionProps) => {
  store.set(state.selectedWorkItems, []);
};
