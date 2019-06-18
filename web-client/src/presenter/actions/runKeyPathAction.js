/**
 * get the role associated with the user
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path object used for invoking the next path in the sequence based on the user's role
 * @param {object} providers.props the cerebral store used for getting the props.key
 * @returns {object} the path to call based on the user role
 */
export const runKeyPathAction = ({ path, props }) => {
  if (path[props.key]) {
    return path[props.key]();
  }
  return path.default();
};
