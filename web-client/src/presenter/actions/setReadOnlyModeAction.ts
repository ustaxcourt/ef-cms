import { state } from '@web-client/presenter/app.cerebral';

export const setReadOnlyModeAction = ({
  props,
  store,
}: ActionProps<{ readOnlyMode: boolean }>) => {
  store.set(state.readOnlyMode, props.readOnlyMode);
};
