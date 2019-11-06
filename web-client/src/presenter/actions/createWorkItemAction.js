import { state } from 'cerebral';

export const createWorkItemAction = async ({
  applicationContext,
  get,
  props,
}) => {
  let assigneeId, message;

  if (props.message) {
    ({ assigneeId, message } = props.message);
  } else {
    ({ assigneeId, message } = get(state.form));
  }

  const { caseId } = get(state.caseDetail);
  const documentId = get(state.documentId);

  await applicationContext.getUseCases().createWorkItemInteractor({
    applicationContext,
    assigneeId,
    caseId,
    documentId,
    message,
  });

  return {
    alertSuccess: {
      message: 'You can view it in the Sent tab on your Message Queue.',
      title: 'Your message was created successfully.',
    },
  };
};
