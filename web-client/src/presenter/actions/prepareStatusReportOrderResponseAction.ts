import { state } from '@web-client/presenter/app.cerebral';

export const prepareStatusReportOrderResponseAction = ({
  get,
  store,
}: ActionProps) => {
  const {
    additionalOrderText,
    dueDate,
    jurisdiction,
    orderType,
    strickenFromTrialSessions,
  } = get(state.form);
  console.log(
    'statusReportOrderResponse',
    get(state.statusReportOrderResponse),
  );

  const { statusReportFilingDate, statusReportIndex } = get(
    state.statusReportOrderResponse,
  );

  const hasOrderType = !!orderType;
  const hasStrickenFromTrialSessions = !!strickenFromTrialSessions;
  const hasJurisdiction = !!jurisdiction;
  const hasAdditionalOrderText = !!additionalOrderText;

  const filedLine = `On ${statusReportFilingDate}, a status report was filed in this case (Index no. ${statusReportIndex}). For cause, it is`;

  const orderTypeLine =
    hasOrderType && orderType === 'statusReport'
      ? `ORDERED that the parties shall file a further status report by ${dueDate}.`
      : hasOrderType
        ? `ORDERED that the parties shall file a status report or proposed stipulated decision by ${dueDate}.`
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

  const richText = `<p>${filedLine}</p><p>${orderTypeLine}</p><p>${strickenLine}</p><p>${jurisdictionLine}</p><pre>${additionalTextLine}</pre>`;

  // TODO, maybe add documentType=Order ?
  store.set(state.form.documentTitle, 'Order');
  store.set(state.form.eventCode, 'O');
  store.set(state.form.richText, richText);
};
