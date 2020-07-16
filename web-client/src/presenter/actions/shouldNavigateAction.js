/**
 * Determines whether to navigate away from the current page or not
 *
 * @param {object} providers the providers object
 * @param {object} providers.path  the next object in the path
 * @param {object} providers.props the cerebral props object
 * @returns {object} continue path for the sequence
 */
export const shouldNavigateAction = ({ path, props }) => {
  if (props.stayOnPage) {
    return path.no();
  }

  return path.yes();
};
