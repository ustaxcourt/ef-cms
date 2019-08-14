import { state } from 'cerebral';

/**
 * returns the alertSuccess object to display an alert message based
 * on the next step the user chose
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @returns {object} the alertSuccess object with default strings
 */
export const getDocketEntryAlertSuccessAction = ({ get, props }) => {
  const { isAddAnother } = props;
  const isUpdatingWithFile = get(state.isUpdatingWithFile);

  let title,
    message = '';

  if (isUpdatingWithFile) {
    title = 'Your document has been saved to the entry.';
    message =
      'You can view the document by clicking on the docket entry below.';
  } else {
    title = 'Your entry has been added to the docket record.';
  }

  if (isAddAnother) {
    message = 'Continue adding docket entries below.';
  }

  return {
    alertSuccess: {
      message,
      title,
    },
  };
};
