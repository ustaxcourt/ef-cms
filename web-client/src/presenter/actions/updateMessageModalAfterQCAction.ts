import { state } from '@web-client/presenter/app.cerebral';

export const updateMessageModalAfterQCAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  store.set(state.modal.validationErrors, {});

  const docketEntryId = get(state.docketEntryId);
  const documentMetadata = get(state.form);
  const documentTitle = applicationContext
    .getUtilities()
    .getDescriptionDisplay(documentMetadata);

  store.set(state.modal.form.subject, documentTitle);

  store.set(state.modal.form.attachments, [
    {
      documentId: docketEntryId,
      documentTitle,
    },
  ]);

  store.set(state.modal.form.draftAttachments, []);
};
