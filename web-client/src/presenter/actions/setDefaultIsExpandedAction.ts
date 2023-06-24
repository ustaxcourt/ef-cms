import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets state.isExpanded to false
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const setDefaultIsExpandedAction = ({ store }: ActionProps) => {
  store.set(state.isExpanded, false);
};
