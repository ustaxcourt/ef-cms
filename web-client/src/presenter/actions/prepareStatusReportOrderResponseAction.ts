import { state } from '@web-client/presenter/app.cerebral';

export const prepareStatusReportOrderResponseAction = ({
  store,
}: ActionProps) => {
  // TODO, setup actual text here..
  const hasOrderType = !!state.form.orderType;
  const hasStrickenFromTrialSessions = !!state.form.strikenFromTrialSessions;
  const hasJurisdiction = !!state.form.jurisdiction;
  const hasAdditionalOrderText = !!state.form.additionalOrderText;

  const filedLine =
    'On [FILED DATE OF SR], a status report was filed in this case (Index no. [INDEX_NUMBER_OF_STATUS_REPORT]). For cause, it is';

  const orderTypeLine =
    hasOrderType && state.form.orderType === 'statusReport'
      ? 'ORDERED that the parties shall file a further status report by [DATE SELECTED].'
      : `ORDERED that the parties shall file a status report or proposed stipulated decision by
  [DATE SELECTED].`;

  const strickenLine =
    hasStrickenFromTrialSessions &&
    'ORDERED that this case is stricken from the trial session. It is further';

  const jurisdictionLine =
    hasJurisdiction && state.form.jurisdiction === 'retained'
      ? 'ORDERED that this case is restored to the general docket'
      : 'ORDERED that jurisdiction is retained by the undersigned.';

  const additionalTextLine =
    hasAdditionalOrderText && `ORDERED that ${state.form.additionalOrderText}.`;

  const richText = `${filedLine}\n\n${hasOrderType && orderTypeLine}\n\n${hasStrickenFromTrialSessions && strickenLine}\n\n${hasJurisdiction && jurisdictionLine}\n\n${hasAdditionalOrderText && additionalTextLine}\n\n`;

  // TODO, maybe add documentType=Order ?
  store.set(state.form.documentTitle, 'Order');
  store.set(state.form.eventCode, 'O');
  store.set(state.form.richText, richText);
};
