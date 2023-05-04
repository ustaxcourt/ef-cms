/**
 * returns the yes or no path depending on if the 30 day NOTT alert has been dismissed
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of yes or no)
 * @returns {object} the next path based on if the 30 day NOTT alert has been dismissed
 */
export const isDismissingThirtyDayAlertAction = ({ path, props }) => {
  return props.dismissedAlertForNOTT ? path.yes() : path.no();
};
