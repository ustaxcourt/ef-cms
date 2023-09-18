import { state } from '@web-client/presenter/app.cerebral';

export const createMessageAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const form = get(state.modal.form);

  const docketNumber = get(state.caseDetail.docketNumber);

  await applicationContext
    .getUseCases()
    .createMessageInteractor(applicationContext, {
      docketNumber,
      ...form,
      attachments: [...form.attachments, ...form.draftAttachments],
    });

  return {
    alertSuccess: {
      message: 'Your message has been sent.',
    },
    qcCompletionAndMessageFlag: true,
  };
};
