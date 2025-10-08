import { state } from '@web-client/presenter/app.cerebral';

/**
 * Sets the modal state for editing remote trial permission from props
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props
 * @param {object} providers.store the cerebral store
 */
export const setRemoteTrialPermissionModalStateAction = ({ props, store }) => {
  // Only set the date - the granted status is derived from whether there's a date
  store.set(
    state.modal.remoteTrialGrantedDate,
    props.remoteTrialGrantedDate || '',
  );
};
