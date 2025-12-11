import { state } from '@web-client/presenter/app.cerebral';

/**
 * validates that documentSelectedForScan is set before scanner actions
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path object
 * @returns {object} the path to execute (error if null, success if set)
 */
export const validateDocumentSelectedForScanAction = ({
  get,
  path,
}: ActionProps) => {
  const documentSelectedForScan = get(
    state.currentViewMetadata.documentSelectedForScan,
  );

  if (!documentSelectedForScan || typeof documentSelectedForScan !== 'string') {
    return path.error({
      error: new Error('No document selected for scan'),
    });
  }

  return path.success();
};
