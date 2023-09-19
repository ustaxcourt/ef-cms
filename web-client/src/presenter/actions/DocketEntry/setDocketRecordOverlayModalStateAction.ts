import { state } from '@web-client/presenter/app.cerebral';

export const setDocketRecordOverlayModalStateAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.modal.docketEntry, props.entry);
};
