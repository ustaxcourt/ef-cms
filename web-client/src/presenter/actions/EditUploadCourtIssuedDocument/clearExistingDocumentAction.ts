import { state } from '@web-client/presenter/app.cerebral';

export const clearExistingDocumentAction = ({ get, store }: ActionProps) => {
  store.set(state.screenMetadata.documentReset, true);
  store.set(state.currentViewMetadata.documentUploadMode, 'scan');
  store.set(state.documentToEdit.docketEntryId, get(state.form.docketEntryId));
  store.set(
    state.documentToEdit.documentStorageId,
    get(state.form.documentStorageId),
  );
  store.unset(state.form.primaryDocumentFile);
};
