import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears the date stamp of the edit remote status form
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const clearRemoteStatusAction = ({ store }: ActionProps) => {
  store.unset(state.modal.remoteTrialGrantedDate);
};
