import { state } from '@web-client/presenter/app.cerebral';

/**
 * returns the yes path with file prop for the current document selected for scan, or the no path, otherwise
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.path the next object in the path
 * @returns {undefined}
 */
export const shouldShowPreviewAction = ({ get, path }: ActionProps) => {
  const documentSelectedForScan = get(
    state.currentViewMetadata.documentSelectedForScan,
  );
  const file = get(state.form[documentSelectedForScan]);
  return file ? path.yes({ file }) : path.no();
};
