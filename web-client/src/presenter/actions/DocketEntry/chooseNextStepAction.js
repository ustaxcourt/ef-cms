import { state } from 'cerebral';

/**
 * used to direct the user to the correct next page - either the case detail page
 * or the supporting document form if they indicated they have supporting documents
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the next object in the path (this is defined in the sequence right after this action is invoked)
 * @returns {*} returns the next action in the sequence's path
 */
export const chooseNextStepAction = ({ get, path }) => {
  const supportingDocument = get(state.screenMetadata.supportingDocument);
  if (supportingDocument) {
    return path.supportingDocument();
  } else {
    return path.caseDetail();
  }
};
