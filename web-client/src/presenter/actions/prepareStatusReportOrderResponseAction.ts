import { state } from '@web-client/presenter/app.cerebral';

export const prepareStatusReportOrderResponseAction = ({
  get,
  store,
}: ActionProps) => {
  // TODO, setup actual text here..
  const {
    additionalOrderText,
    jurisdiction,
    orderType,
    strickenFromTrialSessions,
  } = get(state.form);
  const hasOrderType = !!orderType;
  const hasStrickenFromTrialSessions = !!strickenFromTrialSessions;
  const hasJurisdiction = !!jurisdiction;
  const hasAdditionalOrderText = !!additionalOrderText;

  const filedLine =
    'On [FILED DATE OF SR], a status report was filed in this case (Index no. [INDEX_NUMBER_OF_STATUS_REPORT]). For cause, it is';

  const orderTypeLine =
    hasOrderType && orderType === 'statusReport'
      ? 'ORDERED that the parties shall file a further status report by [DATE SELECTED].'
      : hasOrderType
        ? 'ORDERED that the parties shall file a status report or proposed stipulated decision by [DATE SELECTED].'
        : '';

  const strickenLine = hasStrickenFromTrialSessions
    ? 'ORDERED that this case is stricken from the trial session. It is further'
    : '';

  const jurisdictionLine =
    hasJurisdiction && jurisdiction === 'retained'
      ? 'ORDERED that this case is restored to the general docket'
      : hasJurisdiction
        ? 'ORDERED that jurisdiction is retained by the undersigned.'
        : '';

  const additionalTextLine = hasAdditionalOrderText
    ? `ORDERED that ${additionalOrderText}`
    : '';

  const richText = `${filedLine}\n\n${orderTypeLine}\n\n${strickenLine}\n\n${jurisdictionLine}\n\n${additionalTextLine}\n\n`;

  // TODO, maybe add documentType=Order ?
  store.set(state.form.documentTitle, 'Order');
  store.set(state.form.eventCode, 'O');
  store.set(state.form.richText, richText);
};
