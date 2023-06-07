import { state } from 'cerebral';

export const clearDraftDocumentViewerAction = ({ store }: ActionProps) => {
  store.unset(state.draftDocumentViewerDocketEntryId);
};
