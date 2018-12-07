import { state } from 'cerebral';

export default async ({ props, store }) => {
  store.set(state.documentBlob, props.documentBlob);
  return;
};
