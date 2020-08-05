import { state } from 'cerebral';

/**
 * returns the yes path with file prop for the current document selected for scan, or the no path, otherwise
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get method
 * @param {object} providers.path the next object in the path
 * @returns {undefined}
 */
export const petitionQcShouldShowPreviewAction = ({ get, path }) => {
  const documentSelectedForPreview = get(
    state.currentViewMetadata.documentSelectedForPreview,
  );
  const file = get(state.form[documentSelectedForPreview]);

  return file ? path.yes({ file }) : path.no();
};
