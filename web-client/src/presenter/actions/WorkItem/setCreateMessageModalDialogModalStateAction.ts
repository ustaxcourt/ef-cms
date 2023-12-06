import { state } from '@web-client/presenter/app.cerebral';

export const setCreateMessageModalDialogModalStateAction = ({
  store,
}: ActionProps) => {
  store.set(state.modal.validationErrors, {});
  store.set(state.modal.form, {
    attachments: [],
    draftAttachments: [],
  });
};
