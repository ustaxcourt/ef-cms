/**
 * returns the yes path when a primaryDocumentFile is set, or the no path otherwise
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of yes or no)
 * @returns {object} the next path based on if a primaryDocumentFile is set or not
 */
export const hasPaperAction = async ({ path, props }) => {
  return props.hasPaper ? path.paper() : path.electronic();
};
