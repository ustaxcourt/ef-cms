import { state } from 'cerebral';

/**
 * used to determine whether to redirect to the print paper service screen or not after
 * serving a paper filing
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {Function} providers.get cerebral get function
 * @param {object} providers.path the next object in the path
 * @param {object} providers.props the cerebral props
 * @returns {*} returns the next action in the sequence's path
 */
export const getShouldGoToPaperServiceAction = ({
  applicationContext,
  get,
  path,
  props,
}) => {
  const { isSavingForLater } = props;

  if (isSavingForLater) {
    return path.no();
  } else {
    const caseDetail = get(state.caseDetail);

    const hasPaper =
      applicationContext.getUtilities().aggregatePartiesForService(caseDetail)
        .paper.length > 0;

    if (hasPaper) {
      return path.yes();
    } else {
      return path.no();
    }
  }
};
