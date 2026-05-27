import { Case, isLeadCase } from '@shared/business/entities/cases/Case';
import {
  CASE_STATUS_TYPES,
  MOTION_ORDER_RESPONSE_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import {
  formatDateString,
  FORMATS,
  isValidDateString,
  TimeFormats,
} from '@shared/business/utilities/DateHandler';
import { determineMovantAndNonMovant } from '@web-client/presenter/actions/utilities/determineMovantAndNonMovant';
import { state } from '@web-client/presenter/app.cerebral';
import { formatAdditionalOrderClauseForRichText } from '@web-client/utilities/formatAdditionalOrderClauseForRichText';
import {
  additionalOrderTextArrayWithRequiredFirstField,
  normalizeAdditionalOrderTextArray,
} from '@web-client/utilities/normalizeAdditionalOrderTextArray';

export const prepareMotionOrderResponseAction = ({
  get,
  store,
}: ActionProps) => {
  const {
    additionalOrderTextArray,
    additionalOrderText,
    dueDate,
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

  if (!motion) {
    throw new Error(
      `Could not find docket entry with id ${motionDocketEntryId}`,
    );
  }

  const { movant, nonMovant } = determineMovantAndNonMovant({
    caseDetail,
    motion,
  });
  const { documentTitle: motionDocumentTitle, index } = motion;

  const motionFilingDateFormatted = formatDateString(
    motion.filingDate,
    FORMATS.MONTH_DAY_YEAR,
  );

  const isOnLeadCase = isLeadCase(caseDetail);
  const hasStrickenFromTrialSessions = !!strickenFromTrialSession;
  const rawAdditionalOrderTextArray =
    additionalOrderTextArray ??
    (additionalOrderText ? [additionalOrderText] : []);
  const meaningfulAdditionalOrderTextArray = normalizeAdditionalOrderTextArray(
    rawAdditionalOrderTextArray,
  );
  store.set(
    state.form.additionalOrderTextArray,
    additionalOrderTextArrayWithRequiredFirstField(
      meaningfulAdditionalOrderTextArray,
    ),
  );
  const hasAdditionalOrderTextArray =
    meaningfulAdditionalOrderTextArray.length > 0;

  const dueDateFormatted = isValidDateString(dueDate, [
    FORMATS.YYYYMMDD,
  ] as TimeFormats[])
    ? formatDateString(dueDate, FORMATS.MONTH_DAY_YEAR)
    : '';

  const responseDateFormatted = isValidDateString(responseDate, [
    FORMATS.YYYYMMDD,
  ] as TimeFormats[])
    ? formatDateString(responseDate, FORMATS.MONTH_DAY_YEAR)
    : '';

  let createOrderSelectedCases = [] as any;
  let documentNumberText = `(doc. no. ${index}).`;

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
    documentNumberText = `(lead case doc. no. ${index}).`;
  }

  let preamblePrepend = '';

  if (caseDetail.status === CASE_STATUS_TYPES.calendared) {
    const { trialLocation, trialDate } = caseDetail;
    const formattedTrialDate = formatDateString(
      trialDate,
      FORMATS.MONTH_DAY_YEAR,
    );
    preamblePrepend = `This case is set for trial at the session of the Court commencing on ${formattedTrialDate}, in ${trialLocation}.`;
  }

  const orderVerbiage = `that by ${responseDateFormatted}, ${nonMovant} shall file a Response to the ${motionDocumentTitle}.`;
  const preamble = `<p class="indent-paragraph">${preamblePrepend} On ${motionFilingDateFormatted}, ${movant} filed a ${motionDocumentTitle} ${documentNumberText} For cause, it is </p>`;
  const orderVerbiageHtml = `<p class="indent-paragraph">ORDERED ${orderVerbiage}`;

  const opportunityToRebut = `<p class="indent-paragraph">ORDERED that by ${dueDateFormatted}, ${movant} may file a Reply.`;

  const strickenLine = hasStrickenFromTrialSessions
    ? '<p class="indent-paragraph">ORDERED that this case is stricken from the trial session. It is further</p> <p class="indent-paragraph">ORDERED that jurisdiction is retained by the undersigned.'
    : '';

  let additionalTextLine = '';
  if (hasAdditionalOrderTextArray) {
    meaningfulAdditionalOrderTextArray.forEach((text, index) => {
      const clause = formatAdditionalOrderClauseForRichText(text);
      additionalTextLine += `<p class="indent-paragraph">ORDERED that ${clause}${
        index < meaningfulAdditionalOrderTextArray.length - 1
          ? ' It is further'
          : ''
      }</p>`;
    });
  }

  let richTextString = preamble + orderVerbiageHtml;

  if (dueDate) {
    richTextString = richTextString + ' It is further</p>' + opportunityToRebut;
  }

  if (hasStrickenFromTrialSessions) {
    richTextString = richTextString + ' It is further</p>' + strickenLine;
  }

  if (hasAdditionalOrderTextArray) {
    richTextString = richTextString + ' It is further</p>' + additionalTextLine;
  }

  richTextString = richTextString + '</p>';

  const initialFreeText = `Ordered ${orderVerbiage}`;

  store.set(state.createOrderSelectedCases, createOrderSelectedCases);
  store.set(state.form.initialFreeText, initialFreeText);
  store.set(state.form.orderType, MOTION_ORDER_RESPONSE_OPTIONS.orderType);
  store.set(state.form.documentTitle, 'Order');
  store.set(state.form.documentType, 'Order');
  store.set(state.form.dueDateFormatted, dueDateFormatted);
  store.set(state.form.eventCode, 'O');
  store.set(state.form.richText, richTextString);
  store.set(state.form.showStrickenFromTrialSession, strickenFromTrialSession);
  store.set(state.form.motionOrderResponseFilingDate, responseDate);
  store.set(state.form.parentMessageId, get(state.parentMessageId));
  store.set(state.form.previousDocument, motion);
};
