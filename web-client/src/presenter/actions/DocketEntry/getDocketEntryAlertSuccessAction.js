/**
 * returns the alertSuccess object to display an alert message based
 * on the next step the user chose
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @returns {object} the alertSuccess object with default strings
 */
export const getDocketEntryAlertSuccessAction = ({ props }) => {
  const { isAddAnother } = props;

  if (isAddAnother) {
    return {
      alertSuccess: {
        message: 'Continue adding docket entries below.',
        title: 'Your entry has been added to the docket record.',
      },
    };
  } else {
    return {
      alertSuccess: {
        message: '',
        title: 'Your entry has been added to the docket record.',
      },
    };
  }
};
