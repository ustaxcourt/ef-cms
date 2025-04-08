import { Case } from '@shared/business/entities/cases/Case';
import {
  CASE_STATUS_TYPES,
  MOTION_ORDER_RESPONSE_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import {
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

const determineMovantAndNonMovant = ({ caseDetail, motion }) => {
  const { petitioners } = caseDetail;
  const pNames = petitioners.map(p => p.name);
  const cleanedFiledBy = motion.filedBy.replace(/^(?:Petr\.|Respt\.)?\s*/, '');
  const movant = pNames.some(name => cleanedFiledBy.includes(name))
    ? 'Petitioner'
    : 'Respondent';
  const nonMovant = movant === 'Petitioner' ? 'Respondent' : 'Petitioner';
  return { movant, nonMovant };
};

export const prepareMotionOrderResponseAction = ({
  get,
  store,
}: ActionProps) => {
  const {
    additionalOrderText,
    dueDate,
    motionOrderResponse,
    responseDate,
    strickenFromTrialSession,
    issueOrderFor,
  } = get(state.form);
  const caseDetail = get(state.caseDetail);
  const { docketEntries } = caseDetail;
  const motionDocketEntryId = get(state.docketEntryId);

  const motion = docketEntries.find(
    entry => entry.docketEntryId === motionDocketEntryId,
  );

  const { movant, nonMovant } = determineMovantAndNonMovant({
    caseDetail,
    motion,
  });
  const { documentTitle: motionDocumentTitle, index } = motion;

  const motionFilingDateFormatted = formatDateString(
    motion.filingDate,
    FORMATS.MMDDYYYY,
  );

  const isOnLeadCase = caseDetail.leadDocketNumber === caseDetail.docketNumber;
  const hasStrickenFromTrialSessions = !!strickenFromTrialSession;
  const hasAdditionalOrderText = !!additionalOrderText;

  const dueDateFormatted = formatDateString(dueDate, FORMATS.MMDDYYYY);

  const responseDateFormatted = formatDateString(
    responseDate,
    FORMATS.MMDDYYYY,
  );

  let createOrderSelectedCases = [] as any;

  if (
    isOnLeadCase &&
    issueOrderFor === MOTION_ORDER_RESPONSE_OPTIONS.issueOrderOptions.ALL_CASES
  ) {
    const consolidatedCases = caseDetail.consolidatedCases.map(c => {
      return {
        docketNumber: c.docketNumber,
        docketNumberWithSuffix: c.docketNumberWithSuffix,
        checked: true,
      };
    });
    createOrderSelectedCases = Case.sortByDocketNumber(consolidatedCases);
  }
  let preambleAddendum;

  if (caseDetail.status === CASE_STATUS_TYPES.calendared) {
    const { trialLocation, trialDate } = caseDetail;
    const formattedTrialDate = formatDateString(trialDate, FORMATS.MMDDYYYY);
    preambleAddendum = `This case is set for trial at the session of the Court commencing on ${formattedTrialDate} in ${trialLocation}.`;
  }

  const orderVerbiage = `that by ${responseDateFormatted} the ${nonMovant} shall file a Response to the ${motionDocumentTitle}.`;
  const initialConditionalText = preambleAddendum
    ? `<p class="indent-paragraph">${preambleAddendum}</p>`
    : '';
  const preamble = `<p class="indent-paragraph">ON, ${motionFilingDateFormatted}, ${movant} filed ${motionDocumentTitle} (Document no. ${index}). For cause, it is </p>`;
  const orderVerbiageHtml = `<p class="indent-paragraph">ORDERED ${orderVerbiage}`;

  const typeOfReply =
    motionOrderResponse ===
    MOTION_ORDER_RESPONSE_OPTIONS.orderReplyOptions.REPLY
      ? 'Reply'
      : 'Reply, or if no Reply is filed, shall file a Status Report';
  const opportunityToRebut = `<p class="indent-paragraph">ORDERED that by ${dueDateFormatted} the ${movant} may file a ${typeOfReply}.`;

  const strickenLine = hasStrickenFromTrialSessions
    ? '<p class="indent-paragraph">ORDERED that this case is stricken from the trial session. It is further</p> <p class="indent-paragraph">ORDERED that jurisdiction is retained by the undersigned.'
    : '';

  const additionalTextLine = hasAdditionalOrderText
    ? `<p class="indent-paragraph">ORDERED that ${additionalOrderText}`
    : '';

  let richTextString = preamble + orderVerbiageHtml;

  if (dueDate) {
    richTextString = richTextString + ' It is further</p>' + opportunityToRebut;
  }

  if (hasStrickenFromTrialSessions) {
    richTextString = richTextString + ' It is further</p>' + strickenLine;
  }

  if (hasAdditionalOrderText) {
    richTextString = richTextString + ' It is further</p>' + additionalTextLine;
  }

  richTextString = richTextString + '</p>';

  const finalRichText = initialConditionalText + richTextString;

  const initialFreeText = `Ordered ${orderVerbiage}`;

  store.set(state.createOrderSelectedCases, createOrderSelectedCases);
  store.set(state.form.initialFreeText, initialFreeText);
  store.set(state.form.orderType, MOTION_ORDER_RESPONSE_OPTIONS.orderType);
  store.set(state.form.documentTitle, 'Order');
  store.set(state.form.documentType, 'Order'); // Todo 10586: set in setup function
  store.set(state.form.dueDateFormatted, dueDateFormatted);
  store.set(state.form.eventCode, 'O');
  store.set(state.form.isOnLeadCase, isOnLeadCase);
  store.set(state.form.richText, finalRichText);
  store.set(state.form.showStrickenFromTrialSession, strickenFromTrialSession);
  store.set(state.form.motionOrderResponseFilingDate, responseDate);
  store.set(state.form.parentMessageId, get(state.parentMessageId));
  store.set(state.form.previousDocument, motion);
};
