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

// TODO 10586: Handle consolidated cases

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
    strickenFromTrialSessions,
  } = get(state.form);
  const caseDetail = get(state.caseDetail);
  const { docketEntries } = caseDetail;

  const motion = docketEntries.find(entry =>
    entry.documentType?.includes('Motion'),
  );
  const { movant, nonMovant } = determineMovantAndNonMovant({
    caseDetail,
    motion,
  });
  const { documentTitle, index } = motion;

  const motionFilingDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(motion.filingDate, FORMATS.MMDDYY);

  const isLeadCase = caseDetail.leadDocketNumber === caseDetail.docketNumber;
  const hasStrickenFromTrialSessions = !!strickenFromTrialSessions;
  const hasAdditionalOrderText = !!additionalOrderText;

  const dueDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(dueDate, FORMATS.MMDDYY);

  const responseDateFormatted = applicationContext
    .getUtilities()
    .formatDateString(responseDate, FORMATS.MMDDYY);

  const preamble = `<p class="indent-paragraph">ON, ${motionFilingDateFormatted}, ${movant} filed ${documentTitle} (Document no. ${index}). For cause, </p>`;
  const orderVerbiage = `<p class="indent-paragraph">ORDERED that by ${responseDateFormatted} the ${nonMovant} shall file a Response to the ${documentTitle}.</p>`;
  const opportunityToRebut = `<p class="indent-paragraph">ORDERED that by ${dueDateFormatted} the ${movant} may file a ${motionOrderResponse}.</p>`;

  const strickenLine = hasStrickenFromTrialSessions
    ? '<p class="indent-paragraph">ORDERED that this case is stricken from the trial session.</p>'
    : '';

  const additionalTextLine = hasAdditionalOrderText
    ? `<p class="indent-paragraph">ORDERED that ${additionalOrderText}</p>`
    : '';

  const linesWithText = [
    preamble,
    orderVerbiage,
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

  store.set(state.form.documentTitle, get(state.form.docketEntryDescription));
  store.set(state.form.dueDateFormatted, dueDateFormatted);
  store.set(state.form.eventCode, 'O');
  store.set(state.form.isLeadCase, isLeadCase);
  store.set(state.form.richText, richText);
  store.set(state.form.motionOrderResponseFilingDate, responseDate);
  store.set(state.form.parentMessageId, get(state.parentMessageId));
};
