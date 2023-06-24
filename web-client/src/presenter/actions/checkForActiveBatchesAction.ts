import { state } from '@web-client/presenter/app.cerebral';

/**
 * runs through the props.errors and sets the state.alertError based on which fields failed validation which is used for
 * displaying a list of bullet point alerts in a red error alert at the top of the page.
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object used for getting the props.errors
 * @param {object} providers.store the cerebral store used for setting state.alertError
 * @returns {undefined} doesn't return anything
 */
export const checkForActiveBatchesAction = ({ get, path }: ActionProps) => {
  const batches = get(state.scanner.batches);
  const documentKeys = Object.keys(batches);
  const hasActiveBatches = documentKeys.some(documentKey => {
    return batches[documentKey].length > 0;
  });
  return hasActiveBatches ? path.hasActiveBatches() : path.noActiveBatches();
};
