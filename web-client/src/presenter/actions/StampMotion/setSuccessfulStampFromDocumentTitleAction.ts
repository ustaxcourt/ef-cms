import { state } from '@web-client/presenter/app.cerebral';

/**
 * set the success message in props for successful motion stamp
 * @param {object} params the params object
 * @param {Function} params.get the cerebral get function
 * @param {object} params.store the cerebral store
 * @returns {object} the props with the message
 */
export const setSuccessfulStampFromDocumentTitleAction = ({
  get,
}: ActionProps) => {
  const { docketEntries } = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  const motion = docketEntries.find(d => d.docketEntryId === docketEntryId);

  let successMessage = `${
    motion.documentTitle || motion.documentType
  } stamped successfully.`;

  return {
    alertSuccess: {
      message: successMessage,
    },
  };
};
