import { state } from 'cerebral';

/**
 * returns the alertSuccess object to display an alert message based
 * on the next step the user chose
 *
 * @param {object} providers the providers object
 * @returns {object} the alertSuccess object with default strings
 */
export const getDocketEntryAlertSuccessAction = ({ get }) => {
  const supportingDocument = get(state.screenMetadata.supportingDocument);

  if (supportingDocument) {
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
