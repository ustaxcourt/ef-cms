import { FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const prepareStatusReportOrderResponseAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const {
    additionalOrderText,
    dueDate,
    issueOrder,
    jurisdiction,
    orderType,
    strickenFromTrialSessions,
  } = get(state.form);
  const caseDetail = get(state.caseDetail);
  const { statusReportFilingDate, statusReportIndex } = get(
    state.statusReportOrderResponse,
  );

  const isLeadCase = caseDetail.leadDocketNumber === caseDetail.docketNumber;
  const hasOrderType = !!orderType;
  const hasStrickenFromTrialSessions = !!strickenFromTrialSessions;
  const hasJurisdiction = !!jurisdiction;
  const hasAdditionalOrderText = !!additionalOrderText;

  const dueDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(dueDate, FORMATS.MONTH_DAY_YEAR);

  const statusReportFilingDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(statusReportFilingDate, FORMATS.MONTH_DAY_YEAR);

  const filedLine =
    isLeadCase && issueOrder === 'allCasesInGroup'
      ? `<p class="indent-paragraph">On ${statusReportFilingDateFormatted}, a status report was filed in the lead case of the consolidated group (Index no. ${statusReportIndex}). For cause, it is</p>`
      : `<p class="indent-paragraph">On ${statusReportFilingDateFormatted}, a status report was filed in this case (Index no. ${statusReportIndex}). For cause, it is</p>`;

  const orderTypeLine =
    hasOrderType && orderType === 'statusReport'
      ? `<p class="indent-paragraph">ORDERED that the parties shall file a further status report by ${dueDateFormatted}.</p>`
      : hasOrderType
        ? `<p class="indent-paragraph">ORDERED that the parties shall file a status report or proposed stipulated decision by ${dueDateFormatted}.</p>`
        : '';

  const strickenLine = hasStrickenFromTrialSessions
    ? '<p class="indent-paragraph">ORDERED that this case is stricken from the trial session.</p>'
    : '';

  const jurisdictionLine =
    hasJurisdiction && jurisdiction === 'retained'
      ? '<p class="indent-paragraph">ORDERED that jurisdiction is retained by the undersigned.</p>'
      : hasJurisdiction
        ? '<p class="indent-paragraph">ORDERED that this case is restored to the general docket.</p>'
        : '';

  const additionalTextLine = hasAdditionalOrderText
    ? `<p class="indent-paragraph">ORDERED that ${additionalOrderText}</p>`
    : '';

  const linesWithText = [
    orderTypeLine,
    strickenLine,
    jurisdictionLine,
    additionalTextLine,
  ].filter(line => line);

  const richText =
    filedLine +
    linesWithText
      .map((line, index) => {
        const isLastLine = index === linesWithText.length - 1;
        return isLastLine ? line : line.replace('</p>', ' It is further</p>');
      })
      .join('');

  store.set(state.form.documentTitle, get(state.form.docketEntryDescription));
  store.set(state.form.eventCode, 'O');
  store.set(state.form.richText, richText);
  store.set(state.form.statusReportFilingDate, statusReportFilingDate);
  store.set(state.form.statusReportIndex, statusReportIndex);
};
