import { state } from 'cerebral';

/**
 * sets the state.workQueue based on the props.workItems passed in.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext used for the getUniqueId method
 * @param {object} providers.store the cerebral store used for setting state.workQueue
 * @param {object} providers.props the cerebral props object used for getting the props.workItems
 * @returns {undefined}
 */
export const shouldShowPreviewAction = ({ get, path }) => {
  const documentSelectedForScan = get(
    state.currentViewMetadata.documentSelectedForScan,
  );
  const file = get(state.form[documentSelectedForScan]);
  return file ? path.yes({ file }) : path.no();
};
