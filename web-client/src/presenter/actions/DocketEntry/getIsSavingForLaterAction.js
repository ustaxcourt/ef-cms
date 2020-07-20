/**
 * used to save and serve, or just save a docket entry, depending if props.isSavingForLater is true
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the next object in the path (this is defined in the sequence right after this action is invoked)
 * @param {object} providers.props cerebral props
 * @returns {*} returns the next action in the sequence's path
 */
export const getIsSavingForLaterAction = ({ path, props }) => {
  return props.isSavingForLater ? path.yes() : path.no();
};
