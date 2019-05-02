/**
 * creates the default success alert object
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.props the cerebral props object
 * @returns {Object} the alertSuccess object with default strings
 */
export const getDocketEntryAlertSuccessAction = ({ props }) => {
  if (props && props.supportingDocument) {
    return {
      alertSuccess: {
        message: 'Continue adding related docket entries below.',
        title: 'Your entry has been added to the docket record.',
      },
    };
  } else {
    return {
      alertSuccess: {
        message: 'You can view your entries in the docket record table below.',
        title: 'Your docket entry is complete.',
      },
    };
  }
};
