/**
 * allows you to skip path based on props
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the next object in the path
 * @param {object} providers.props the cerebral props that contain the props.doNotProceed
 * @returns {object} the results of the executed path
 */
export const shouldNavigateToConfirmationAction = ({ path, props }) => {
  if (props.navigateToConfirmation) return path.proceed();
  return path.ignore();
};
