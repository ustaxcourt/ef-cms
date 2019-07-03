import { state } from 'cerebral';

export const createWorkItemAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const { assigneeId, message } = get(state.form);
  const { caseId } = get(state.caseDetail);
  const documentId = get(state.documentId);

  await applicationContext.getUseCases().createWorkItemInteractor({
    applicationContext,
    assigneeId,
    caseId,
    documentId,
    message,
  });

  return path.success({
    alertSuccess: {
      message: 'You can view it in the Sent tab on your Message Queue.',
      title: 'Your message was created successfully.',
    },
  });
};
