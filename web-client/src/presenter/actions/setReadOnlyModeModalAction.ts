import { state } from '@web-client/presenter/app.cerebral';

export const setReadOnlyModeModalAction = ({
  props,
  store,
  get,
}: ActionProps<{ readOnlyMode: boolean }>) => {
  const currentReadOnlyMode = get(state.readOnlyMode);
  // Only pop the modal if we are transitioning from false to true
  if (props.readOnlyMode && !currentReadOnlyMode) {
    store.set(state.modal.showModal, 'ReadOnlyModeEngagedModal');
  }
};
