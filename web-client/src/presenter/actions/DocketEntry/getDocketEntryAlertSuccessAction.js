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

  let message = '';

  if (isUpdatingWithFile) {
    message = 'Entry updated.';
  } else {
    message = 'Entry added to Docket Record.';
  }

  if (isAddAnother) {
    message = 'Entry added. Continue adding docket entries below.';
  }

  return {
    alertSuccess: {
      message,
    },
  };
};
