/**
 * Fetches the trial sessions using the getTrialSessions use case
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the props object
 * @returns {object} the new object of html of docket records
 */

export const stashDocketRecordHtmlAction = async ({ props }) => {
  let { caseDetail, caseHtml, contentHtml } = props;
  const { caseId } = caseDetail;

  caseHtml = caseHtml || {};
  caseHtml[caseId] = contentHtml;

  return { caseHtml };
};
