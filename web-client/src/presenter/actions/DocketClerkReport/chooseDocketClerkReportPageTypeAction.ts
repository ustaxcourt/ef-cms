import { state } from '@web-client/presenter/app.cerebral';

/**
 * branches the docket clerk report sequence based on the selected page type
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path function
 * @returns {object} the path to take (documentQC or messages)
 */
export const chooseDocketClerkReportPageTypeAction = ({
  get,
  path,
}: ActionProps) => {
  const pageType = get(state.docketClerkReport.pageType);

  if (pageType === 'messages') {
    return path.messages();
  }

  return path.documentQC();
};
