import { state } from '@web-client/presenter/app.cerebral';

/**
 * Fetches the case caption using the getCaseCaption helper method
 * @param {object} providers the providers object
 * @param {Function} providers.applicationContext application context to get Case entity
 * @param {Function} providers.get the cerebral get function
 * @returns {object} contains the caseCaption
 */
export const getCaseCaptionForCaseInfoTabAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  const caseDetail = get(state.form);

  const caseCaption =
    applicationContext
      .getUtilities()
      .getCaseCaption({ ...caseDetail, petitioners: [] }) || '';

  return { caseCaption };
};
