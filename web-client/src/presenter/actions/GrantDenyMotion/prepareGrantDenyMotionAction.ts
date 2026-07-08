import { Case, isLeadCase } from '@shared/business/entities/cases/Case';
import {
  CASE_STATUS_TYPES,
  GRANT_DENY_MOTION_OPTIONS,
  MOTION_DISPOSITIONS,
} from '@shared/business/entities/EntityConstants';
import {
  formatDateString,
  FORMATS,
  isValidDateString,
  TimeFormats,
} from '@shared/business/utilities/DateHandler';
import { ConsolidatedCasesWithCheckboxInfoType } from '@web-client/presenter/actions/CaseConsolidation/setMultiDocketingCheckboxesAction';
import { determineMovantAndNonMovant } from '@web-client/presenter/actions/utilities/determineMovantAndNonMovant';
import { state } from '@web-client/presenter/app.cerebral';
import {
  additionalOrderTextArrayWithRequiredFirstField,
  normalizeAdditionalOrderTextArray,
} from '@web-client/utilities/normalizeAdditionalOrderTextArray';

const buildDispositionPhrase = ({
  deniedAsMoot,
  deniedWithoutPrejudice,
  disposition,
}: {
  deniedAsMoot?: boolean;
  deniedWithoutPrejudice?: boolean;
  disposition?: string;
}): string => {
  if (disposition === MOTION_DISPOSITIONS.GRANTED) return 'granted';
  if (disposition !== MOTION_DISPOSITIONS.DENIED) return '';
  const parts = ['denied'];
  if (deniedAsMoot) parts.push('as moot');
  if (deniedWithoutPrejudice) parts.push('without prejudice');
  return parts.join(' ');
};

const wrap = (inner: string) =>
  `<p class="${GRANT_DENY_MOTION_OPTIONS.pdfParagraphClass}">${inner}</p>`;

const buildPreamble = ({
  documentNumberText,
  motionDocumentTitle,
  motionFilingDateFormatted,
  movant,
  preamblePrepend,
}: {
  documentNumberText: string;
  motionDocumentTitle: string;
  motionFilingDateFormatted: string;
  movant: string;
  preamblePrepend: string;
}): string =>
  wrap(`${preamblePrepend}On ${motionFilingDateFormatted}, ${movant} filed a`) +
  wrap(`${motionDocumentTitle} ${documentNumberText}. For cause, it is`);

const getMovantPossessive = (movant: string): string =>
  movant === 'respondent' ? "respondent's" : "petitioner's";

const formatFilingPartyForDocument = (filingParty: string): string =>
  filingParty.toLowerCase();

const buildStatusReportClause = ({
  dueDateFormatted,
  dueDateMessage,
  filingParty,
}: {
  dueDateFormatted: string;
  dueDateMessage?: string | null;
  filingParty?: string | null;
}): string => {
  if (!filingParty || !dueDateFormatted || !dueDateMessage) {
    return '';
  }

  const isJoint =
    filingParty === GRANT_DENY_MOTION_OPTIONS.filingPartyOptions.joint;
  const isParties =
    filingParty === GRANT_DENY_MOTION_OPTIONS.filingPartyOptions.parties;

  if (
    dueDateMessage ===
    GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions.statusReport
  ) {
    if (isJoint) {
      return wrap(
        `ORDERED that the parties shall file a joint status report by ${dueDateFormatted}.`,
      );
    }
    if (isParties) {
      return wrap(
        `ORDERED that the parties shall file a status report(s) by ${dueDateFormatted}.`,
      );
    }
    return wrap(
      `ORDERED that ${formatFilingPartyForDocument(filingParty)} shall file a status report by ${dueDateFormatted}.`,
    );
  }

  if (
    dueDateMessage ===
    GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions
      .statusReportOrStipulatedDecision
  ) {
    if (isJoint) {
      return wrap(
        `ORDERED that the parties shall file a joint status report or proposed stipulated decision by ${dueDateFormatted}.`,
      );
    }
    if (isParties) {
      return wrap(
        `ORDERED that the parties shall file a status report(s) or proposed stipulated decision by ${dueDateFormatted}.`,
      );
    }
    return wrap(
      `ORDERED that ${formatFilingPartyForDocument(filingParty)} shall file a status report or proposed stipulated decision by ${dueDateFormatted}.`,
    );
  }

  return '';
};

const joinWithItIsFurther = (clauses: string[]): string =>
  clauses
    .map((clause, idx) =>
      idx === clauses.length - 1
        ? clause
        : clause.replace(/<\/p>$/, ' It is further</p>'),
    )
    .join('');

export const prepareGrantDenyMotionAction = ({ get, store }: ActionProps) => {
  const {
    additionalOrderText,
    deniedAsMoot,
    deniedWithoutPrejudice,
    disposition,
    dueDate,
    dueDateMessage,
    filingParty,
    issueOrder,
    jurisdiction,
    strickenFromTrialSession,
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

  const { movant } = determineMovantAndNonMovant({ caseDetail, motion });
  const { documentTitle: motionDocumentTitle, index } = motion;

  const motionFilingDateFormatted = formatDateString(
    motion.filingDate,
    FORMATS.MONTH_DAY_YEAR,
  );

  const isOnLeadCase = isLeadCase(caseDetail);
  const isCalendared = caseDetail.status === CASE_STATUS_TYPES.calendared;

  const dueDateFormatted = isValidDateString(dueDate, [
    FORMATS.YYYYMMDD,
  ] as TimeFormats[])
    ? formatDateString(dueDate, FORMATS.MONTH_DAY_YEAR)
    : '';

  let createOrderSelectedCases: Pick<
    ConsolidatedCasesWithCheckboxInfoType,
    'checked' | 'docketNumber' | 'docketNumberWithSuffix'
  >[] = [];
  let documentNumberText = `(doc. no. ${index})`;

  if (
    isOnLeadCase &&
    issueOrder === GRANT_DENY_MOTION_OPTIONS.issueOrderOptions.allCasesInGroup
  ) {
    const consolidatedCases = caseDetail.consolidatedCases.map(c => ({
      docketNumber: c.docketNumber,
      docketNumberWithSuffix: c.docketNumberWithSuffix,
      checked: true,
    }));
    createOrderSelectedCases = Case.sortByDocketNumber(consolidatedCases);
    documentNumberText = `(lead case doc. no. ${index})`;
  }

  let preamblePrepend = '';
  let formattedTrialDate = '';
  let trialLocationText = '';
  if (isCalendared) {
    formattedTrialDate = formatDateString(
      caseDetail.trialDate,
      FORMATS.MONTH_DAY_YEAR,
    );
    trialLocationText = caseDetail.trialLocation || '';
    preamblePrepend = `This case is set for trial at the session of the Court commencing on ${formattedTrialDate}, in ${trialLocationText}. `;
  }

  const preamble = buildPreamble({
    documentNumberText,
    motionDocumentTitle,
    motionFilingDateFormatted,
    movant,
    preamblePrepend,
  });

  const dispositionPhrase = buildDispositionPhrase({
    deniedAsMoot,
    deniedWithoutPrejudice,
    disposition,
  });

  const dispositionClause =
    dispositionPhrase.length > 0
      ? wrap(
          `ORDERED that ${getMovantPossessive(movant)} ${motionDocumentTitle} is ${dispositionPhrase}.`,
        )
      : '';

  const strickenClause = strickenFromTrialSession
    ? wrap(
        `ORDERED that this case is stricken from the ${formattedTrialDate}, ${trialLocationText} trial session.`,
      )
    : '';

  const restoredClause =
    jurisdiction === GRANT_DENY_MOTION_OPTIONS.jurisdictionOptions.restored
      ? wrap('ORDERED that this case is restored to the general docket.')
      : '';

  const retainedClause =
    jurisdiction === GRANT_DENY_MOTION_OPTIONS.jurisdictionOptions.retained
      ? wrap('ORDERED that jurisdiction is retained by the undersigned.')
      : '';

  const statusReportClause = buildStatusReportClause({
    dueDateFormatted,
    dueDateMessage,
    filingParty,
  });

  const meaningfulAdditionalOrderText = normalizeAdditionalOrderTextArray(
    additionalOrderText ?? [],
  );
  store.set(
    state.form.additionalOrderText,
    additionalOrderTextArrayWithRequiredFirstField(
      meaningfulAdditionalOrderText,
    ),
  );

  const additionalClauses: string[] = meaningfulAdditionalOrderText.map(text =>
    wrap(`ORDERED that ${text}.`),
  );

  const orderedClauses = [
    dispositionClause,
    strickenClause,
    restoredClause,
    retainedClause,
    statusReportClause,
    ...additionalClauses,
  ].filter(Boolean);

  const richText = preamble + joinWithItIsFurther(orderedClauses);

  const docketEntryDescription =
    dispositionPhrase.length > 0
      ? `Order - ${motionDocumentTitle} is ${dispositionPhrase}`
      : `Order - ${motionDocumentTitle}`;

  store.set(state.createOrderSelectedCases, createOrderSelectedCases);
  store.set(state.form.documentTitle, docketEntryDescription);
  store.set(state.form.documentType, 'Order');
  store.set(state.form.eventCode, 'O');
  store.set(state.form.orderType, GRANT_DENY_MOTION_OPTIONS.orderType);
  store.set(state.form.richText, richText);
  store.set(state.form.parentMessageId, get(state.parentMessageId));
  store.set(state.form.previousDocument, motion);

  const documentToEdit = get(state.documentToEdit);
  if (documentToEdit?.docketEntryId) {
    store.set(state.form.docketEntryIdToEdit, documentToEdit.docketEntryId);
  }
};
