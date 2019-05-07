/**
 * used to direct the user to the correct next page - either the case detail page
 * or the supporting document form if they indicated they have supporting documents
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.props the cerebral props object
 * @param {Object} providers.props.supportingDocument boolean that indicates whether or not they have supporting documents to upload
 * @param {Object} providers.path the next object in the path (this is defined in the sequence right after this action is invoked)
 * @returns {*} returns the next action in the sequence's path
 */
export const chooseNextStepAction = ({ props, path }) => {
  if (props && props.supportingDocument) {
    return path.supportingDocument();
  } else {
    return path.caseDetail();
  }
};
