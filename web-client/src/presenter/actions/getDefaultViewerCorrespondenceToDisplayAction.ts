import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * gets the first correspondence document from the current case detail to set as the default viewerCorrespondenceToDisplay
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get method
 * @param {object} providers.props the cerebral props object
 * @returns {object} object containing viewerDocumentToDisplay
 */
export const getDefaultViewerCorrespondenceToDisplayAction = ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const { correspondenceId } = props;
  let viewerCorrespondenceToDisplay = null;

  const caseDetail = get(state.caseDetail);

  const { correspondence } = applicationContext
    .getUtilities()
    .formatCase(applicationContext, cloneDeep(caseDetail));

  if (correspondenceId) {
    viewerCorrespondenceToDisplay = correspondence.find(
      d => d.correspondenceId === correspondenceId,
    );
  } else {
    viewerCorrespondenceToDisplay = correspondence[0];
  }

  return {
    viewerCorrespondenceToDisplay,
  };
};
