/**
 * sets alert success message for completing a docket entry
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object
 * @returns {object} return object
 */
export const setCompleteDocketEntryAlertAction = ({ props }) => {
  return {
    alertSuccess: {
      message: `${props.updatedDocument.documentTitle} QC completed and message sent.`,
    },
  };
};
