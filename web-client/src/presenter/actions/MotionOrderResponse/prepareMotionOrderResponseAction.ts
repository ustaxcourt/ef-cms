import { FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const prepareMotionOrderResponseAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  // TODO 10586: Implement prepareMotionOrderResponseAction action

  const {
    additionalOrderText,
    dueDate,
    motionOrderResponse,
    responseDate,
    strickenFromTrialSessions,
  } = get(state.form);
  const caseDetail = get(state.caseDetail);

  const isLeadCase = caseDetail.leadDocketNumber === caseDetail.docketNumber;
  const hasStrickenFromTrialSessions = !!strickenFromTrialSessions;
  const hasAdditionalOrderText = !!additionalOrderText;

  const dueDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(dueDate, FORMATS.MMDDYY);

  const preamble = `<p class="indent-paragraph">ON, {motionFiledDate}, {movant} filed {motionName} (Document no. {documentNumber}). For cause, it is </p>`;
  const orderVerbiage = `<p class="indent-paragraph">ORDERED that by {responseDate} the {nonMovant} shall file an ${motionOrderResponse} to the {motionName}.</p>`;
  const opportunityToRebut = `<p class="indent-paragraph">ORDERED that by {dueDate} the {movant} may file a {motionOrderResponse}.</p>`;
  // const motionOrderResponseLine = motionOrderResponse; // TODO 10586: add logic to determine motionOrderResponseLine

  const strickenLine = hasStrickenFromTrialSessions
    ? '<p class="indent-paragraph">ORDERED that this case is stricken from the trial session.</p>'
    : '';

  const additionalTextLine = hasAdditionalOrderText
    ? `<p class="indent-paragraph">ORDERED that ${additionalOrderText}</p>`
    : '';

  const linesWithText = [
    preamble,
    orderVerbiage,
    opportunityToRebut,
    strickenLine,
    additionalTextLine,
  ].filter(line => line);

  const richText = linesWithText
    .map((line, index) => {
      const isLastLine = index === linesWithText.length - 1;
      return isLastLine ? line : line.replace('</p>', ' It is further</p>');
    })
    .join('');

  store.set(state.form.documentTitle, get(state.form.docketEntryDescription));
  store.set(state.form.dueDateFormatted, dueDateFormatted);
  store.set(state.form.eventCode, 'O');
  store.set(state.form.isLeadCase, isLeadCase);
  store.set(state.form.richText, richText);
  store.set(state.form.motionOrderResponseFilingDate, responseDate);
  store.set(state.form.parentMessageId, get(state.parentMessageId));
};
