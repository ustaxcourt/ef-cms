/**
 * returns yes if we should create the paper service pdf
 * @param {object} providers the providers object
 * @param {Function} providers.path the cerebral path method
 * @param {object} providers.props the cerebral props object
 * @returns {object} the path yes or no depending on if the paper service pdf needs to be created
 */
export const shouldCreatePaperServicePdfForCasesAction = ({
  path,
  props,
}: ActionProps) => {
  const { trialNoticePdfsKeys } = props;

  if (trialNoticePdfsKeys.length) {
    return path.yes();
  } else {
    return path.no();
  }
};
