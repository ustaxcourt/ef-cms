import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

/**
 * gets the first correspondence document from the current case detail to set as the default viewerCorrespondenceToDisplay
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get method
 * @returns {object} object containing viewerDocumentToDisplay
 */
export const getDefaultViewerCorrespondenceToDisplayAction = ({
  applicationContext,
  get,
}) => {
  let viewerCorrespondenceToDisplay = null;

  const caseDetail = get(state.caseDetail);

  const { correspondence } = applicationContext
    .getUtilities()
    .formatCase(applicationContext, cloneDeep(caseDetail));

  viewerCorrespondenceToDisplay = correspondence[0];

  return {
    viewerCorrespondenceToDisplay,
  };
};
