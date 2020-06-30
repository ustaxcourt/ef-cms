import { state } from 'cerebral';

/**
 * creates the success alert object
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 * @returns {object} the alertSuccess object
 */
export const getFileExternalDocumentAlertSuccessAction = ({
  get,
  props,
  store,
}) => {
  const documentToEdit = get(state.documentToEdit);
  const isCreatingOrder = get(state.isCreatingOrder);

  const alertSuccess = {
    message: 'Document filed and is accessible from the Docket Record.',
  };

  if (props.documentWithPendingAssociation) {
    alertSuccess.message =
      'Document filed and pending approval. Please check your dashboard for updates.';
  }

  if (isCreatingOrder) {
    store.unset(state.isCreatingOrder);
    alertSuccess.message =
      'Your document has been successfully created and attached to this message';
  }

  if (documentToEdit) {
    return {
      alertSuccess: {
        message: 'Changes saved.',
      },
    };
  }

  if (props.printReceiptLink) {
    alertSuccess.linkUrl = props.printReceiptLink;
    alertSuccess.linkText = 'Print receipt.';
  }

  return {
    alertSuccess,
  };
};
