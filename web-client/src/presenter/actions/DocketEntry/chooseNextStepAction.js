import { state } from 'cerebral';

/**
 * used to direct the user to the correct next page - either the isElectronic or isPaper
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get cerebral get function
 * @param {object} providers.path the next object in the path (this is defined in the sequence right after this action is invoked)
 * @param {object} providers.applicationContext the applicationContext
 * @returns {*} returns the next action in the sequence's path
 */
export const chooseNextStepAction = ({ applicationContext, get, path }) => {
  const caseDetail = get(state.caseDetail);

  const hasPaper =
    applicationContext.getUtilities().aggregatePartiesForService(caseDetail)
      .paper.length > 0;

  if (hasPaper) {
    return path.isPaper();
  } else {
    return path.isElectronic();
  }
};
