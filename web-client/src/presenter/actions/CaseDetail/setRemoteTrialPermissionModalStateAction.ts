import { state } from '@web-client/presenter/app.cerebral';

/**
 * Sets the modal state for editing remote trial permission from props
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 */
export const setRemoteTrialPermissionModalStateAction = ({ get, store }) => {
  const caseDetail = get(state.caseDetail);

  store.set(
    state.modal.remoteTrialGrantedDate,
    caseDetail.remoteTrialGrantedDate || '',
  );
};
