import { Case } from '@shared/business/entities/cases/Case';
import { CONSOLIDATED_GROUP_ORDER_FOR } from '@shared/business/entities/EntityConstants';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

const determineMovantAndNonMovant = ({ caseDetail, motion }) => {
  const { petitioners } = caseDetail;
  const pNames = petitioners.map(p => p.name);
  const cleanedFiledBy = motion.filedBy.replace(
    /^(?:Petr\.|Respt\.|Intvr\.)?\s*/,
    '',
  );
  const movant = pNames.some(name => cleanedFiledBy.includes(name))
    ? 'Petitioner'
    : 'Respondent';
  const nonMovant = movant === 'Petitioner' ? 'Respondent' : 'Petitioner';
  return { movant, nonMovant };
};

export const prepareMotionOrderResponseAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const {
    additionalOrderText,
    dueDate,
    motionOrderResponse,
    responseDate,
    strickenFromTrialSession,
    consolidatedGroupOrderFor,
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

  const motionFilingDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(motion.filingDate, FORMATS.MMDDYY);

  const isOnLeadCase = caseDetail.leadDocketNumber === caseDetail.docketNumber;
  const hasStrickenFromTrialSessions = !!strickenFromTrialSession;
  const hasAdditionalOrderText = !!additionalOrderText;

  const dueDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(dueDate, FORMATS.MMDDYY);

  const responseDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(responseDate, FORMATS.MMDDYY);

  // let docketNumbersToDisplay = [caseDetail.docketNumber];
  let createOrderSelectedCases = [] as any;

  if (
    isOnLeadCase &&
    consolidatedGroupOrderFor === CONSOLIDATED_GROUP_ORDER_FOR.ALL_CASES
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

  const orderVerbiage = `that by ${responseDateFormatted} the ${nonMovant} shall file a Response to the ${motionDocumentTitle}.`;
  const preamble = `<p class="indent-paragraph">ON, ${motionFilingDateFormatted}, ${movant} filed ${motionDocumentTitle} (Document no. ${index}). For cause, </p>`;
  const orderVerbiageHtml = `<p class="indent-paragraph">ORDERED ${orderVerbiage} </p>`;
  const opportunityToRebut = `<p class="indent-paragraph">ORDERED that by ${dueDateFormatted} the ${movant} may file a ${motionOrderResponse}.</p>`;

  const strickenLine = hasStrickenFromTrialSessions
    ? '<p class="indent-paragraph">ORDERED that this case is stricken from the trial session.</p>'
    : '';

  const additionalTextLine = hasAdditionalOrderText
    ? `<p class="indent-paragraph">ORDERED that ${additionalOrderText}</p>`
    : '';

  const linesWithText = [
    preamble,
    orderVerbiageHtml,
    dueDate ? opportunityToRebut : '',
    strickenLine,
    additionalTextLine,
  ].filter(line => line);

  const richText = linesWithText
    .map((line, index) => {
      const isLastLine = index === linesWithText.length - 1;
      return isLastLine ? line : line.replace('</p>', ' It is further</p>');
    })
    .join('');

  const initialFreeText = `Ordered ${orderVerbiage}`;

  store.set(state.createOrderSelectedCases, createOrderSelectedCases);
  // store.set(state.form.documentTitle, get(state.form.docketEntryDescription));
  store.set(state.form.initialFreeText, initialFreeText);
  store.set(state.form.orderType, 'motionOrderResponse');
  store.set(state.form.documentTitle, 'Order');
  store.set(state.form.documentType, 'Order'); // Todo 10586: set in setup function
  store.set(state.form.dueDateFormatted, dueDateFormatted);
  store.set(state.form.eventCode, 'O');
  store.set(state.form.isOnLeadCase, isOnLeadCase);
  store.set(state.form.richText, richText);
  store.set(state.form.showStrickenFromTrialSession, strickenFromTrialSession);
  store.set(state.form.motionOrderResponseFilingDate, responseDate);
  store.set(state.form.parentMessageId, get(state.parentMessageId));
  store.set(state.form.previousDocument, motion);
};
