import { state } from 'cerebral';

export const setDocumentUploadModeAction = ({ props, store }) => {
  store.set(state.documentUploadMode, props.documentUploadMode);
};
