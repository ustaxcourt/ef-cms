/**
 * gets props.gotoAfterSigning to determine where to redirect after signing a document
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which contains the next path in the sequence
 * @param {object} providers.props the cerebral props that contain the props.gotoAfterSigning
 * @returns {Promise} async action
 */
export const getGotoAfterSigningAction = async ({ path, props }) => {
  if (props.gotoAfterSigning) {
    return path[props.gotoAfterSigning]();
  } else {
    return path.CaseDetail();
  }
};
