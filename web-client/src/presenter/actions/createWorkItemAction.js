import { state } from 'cerebral';

export const createWorkItemAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const { assigneeId, message } = get(state.form);
  const { caseId } = get(state.caseDetail);
  const documentId = get(state.documentId);

  await applicationContext.getUseCases().createWorkItem({
    applicationContext,
    assigneeId,
    caseId,
    documentId,
    message,
  });

  return path.success({
    alertSuccess: {
      message: 'The message thread was created.',
      title: 'Your message thread was created successfully.',
    },
  });
};
