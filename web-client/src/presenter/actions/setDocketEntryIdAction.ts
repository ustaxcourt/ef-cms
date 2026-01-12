import { state } from '@web-client/presenter/app.cerebral';

export const setDocketEntryIdAction = ({ props, store }: ActionProps) => {
  store.set(state.docketEntryId, props.docketEntryId);
};
