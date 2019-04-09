/**
 * allows you to skip path based on props
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.path the next object in the path
 * @param {Object} providers.props the cerebral props that contain the props.doNotProceed
 */
export const shouldProceedAction = ({ path, props }) => {
  if (props.doNotProceed) return path.ignore();
  return path.proceed();
};
