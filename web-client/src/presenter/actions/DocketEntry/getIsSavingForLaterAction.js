/**
 * used to direct the user to the correct next page - either the isElectronic or isPaper
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get cerebral get function
 * @param {object} providers.path the next object in the path (this is defined in the sequence right after this action is invoked)
 * @param {object} providers.applicationContext the applicationContext
 * @returns {*} returns the next action in the sequence's path
 */
export const getIsSavingForLaterAction = ({ path, props }) => {
  return props.isSavingForLater ? path.no() : path.yes();
};
