/**
 * Retrieves and returns the corresponding path for the tab prop passed
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral props
 * @param {Function} providers.path the cerebral path function
 * @returns {object} path
 */
export const getInternalCaseCaptionAction = async ({ path, props }) => {
  const { tab } = props;

  if (tab === 'caseInfo') {
    return path.caseInfo();
  }
};
