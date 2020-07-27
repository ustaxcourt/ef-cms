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

  const docketNumber = get(state.caseDetail.docketNumber);
  const documentId = get(state.documentId);

  await applicationContext.getUseCases().createWorkItemInteractor({
    applicationContext,
    assigneeId,
    docketNumber,
    documentId,
    message,
  });

  return {
    alertSuccess: {
      message: 'Message sent.',
    },
  };
};
