import { state } from 'cerebral';
/**
 * Fetches and stashes the case details of the current case
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the get function
 * @returns {object} the new object of case details
 */

export const stashCaseDetailByCaseIdAction = async ({ get, props }) => {
  let { caseDetails } = props;
  const caseDetail = get(state.formattedCaseDetail);
  const caseDetailHelper = get(state.caseDetailHelper);

  const { caseId } = caseDetail;

  caseDetails = caseDetails || {};
  caseDetails[caseId] = {
    ...caseDetail,
    showCaseNameForPrimary: caseDetailHelper.showCaseNameForPrimary,
    caseCaptionPostfix: caseDetailHelper.caseCaptionPostfix,
  };

  return { caseDetails };
};
