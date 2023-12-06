import { state } from '@web-client/presenter/app.cerebral';

/**
 * returns the alertSuccess object to display an alert message based
 * on the next step the user chose
 * @param {object} providers the providers object
 * @returns {object} the alertSuccess object with default strings
 */
export const getDocketEntryAlertSuccessAction = ({ get }: ActionProps) => {
  const isUpdatingWithFile = get(state.isUpdatingWithFile);

  let message = '';

  if (isUpdatingWithFile) {
    message = 'Entry updated.';
  } else {
    message = 'Your entry has been added to the docket record.';
  }

  return {
    alertSuccess: {
      message,
    },
  };
};
