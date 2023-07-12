import { state } from '@web-client/presenter/app.cerebral';

export const clearDraftDocumentViewerAction = ({ store }: ActionProps) => {
  store.unset(state.draftDocumentViewerDocketEntryId);
};
