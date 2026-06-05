import { GRANT_DENY_MOTION_OPTIONS } from '@shared/business/entities/EntityConstants';

export type StampDataRecord = Record<string, unknown>;

export type ResolveMotionDocketEntryIdParams = {
  documentTitle?: string | null;
  freeText?: string | null;
  motionDocketEntryIdFromStampData?: string | null;
  previousDocumentDocketEntryId?: string | null;
  stampedOrderDocketEntryId: string;
  caseDocketEntries: ReadonlyArray<{
    docketEntryId: string;
    documentTitle?: string | null;
    documentType?: string | null;
    filingDate?: string | Date | null;
    isDraft?: boolean | null;
  }>;
};

const STAMPED_ORDER_TITLE_MOTION_TYPE_PATTERN =
  /^Order - (.+?) - (?:GRANTED|DENIED)/i;

export const resolveMotionTypeFromStampedOrderTitle = (
  documentTitleOrFreeText?: string | null,
): string | undefined => {
  if (!documentTitleOrFreeText) {
    return undefined;
  }

  const match = documentTitleOrFreeText.match(
    STAMPED_ORDER_TITLE_MOTION_TYPE_PATTERN,
  );

  return match?.[1]?.trim();
};

export const resolveMotionDocketEntryIdForStampedOrder = ({
  caseDocketEntries,
  documentTitle,
  freeText,
  motionDocketEntryIdFromStampData,
  previousDocumentDocketEntryId,
  stampedOrderDocketEntryId,
}: ResolveMotionDocketEntryIdParams): string | undefined => {
  if (motionDocketEntryIdFromStampData) {
    return motionDocketEntryIdFromStampData;
  }

  if (previousDocumentDocketEntryId) {
    return previousDocumentDocketEntryId;
  }

  const motionTypeFromTitle =
    resolveMotionTypeFromStampedOrderTitle(documentTitle) ||
    resolveMotionTypeFromStampedOrderTitle(freeText);

  if (!motionTypeFromTitle) {
    return undefined;
  }

  const matchingMotions = caseDocketEntries
    .filter(
      entry =>
        entry.docketEntryId !== stampedOrderDocketEntryId &&
        !entry.isDraft &&
        (entry.documentType === motionTypeFromTitle ||
          entry.documentTitle === motionTypeFromTitle),
    )
    .sort((a, b) => {
      const aDate = a.filingDate ? String(a.filingDate) : '';
      const bDate = b.filingDate ? String(b.filingDate) : '';
      return bDate.localeCompare(aDate);
    });

  return matchingMotions[0]?.docketEntryId;
};

const translateJurisdiction = (
  jurisdictionalOption: unknown,
): string | null => {
  if (jurisdictionalOption === 'Jurisdiction is retained by the undersigned') {
    return GRANT_DENY_MOTION_OPTIONS.jurisdictionOptions.retained;
  }
  if (jurisdictionalOption === 'The case is restored to the general docket') {
    return GRANT_DENY_MOTION_OPTIONS.jurisdictionOptions.restored;
  }
  return null;
};

const translateDueDateMessage = (dueDateMessage: unknown): string | null => {
  if (dueDateMessage === 'The parties shall file a status report by') {
    return GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions.statusReport;
  }
  if (
    dueDateMessage ===
    'The parties shall file a status report or proposed stipulated decision by'
  ) {
    return GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions
      .statusReportOrStipulatedDecision;
  }
  return null;
};

const translateDueDate = (date: unknown): string | null => {
  if (
    typeof date !== 'string' ||
    !/^[0-9]{2}\/[0-9]{2}\/[0-9]{2}$/.test(date)
  ) {
    return null;
  }

  const [month, day, year] = date.split('/');
  const fullYear = Number(year) < 50 ? `20${year}` : `19${year}`;

  return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const translateAdditionalOrderText = (customText: unknown): string[] => {
  if (typeof customText === 'string' && customText.trim() !== '') {
    return [customText];
  }
  return [''];
};

/**
 * Mirrors the Postgres translation in
 * `2026-05-01T17_00_00Z-backfill-draftOrderState-from-stampData.expand.ts`.
 */
export const translateStampDataToDraftOrderState = (
  stampData: StampDataRecord,
  options?: {
    documentTitle?: string | null;
    freeText?: string | null;
    motionDocketEntryId?: string | null;
    previousDocumentDocketEntryId?: string | null;
    stampedOrderDocketEntryId?: string;
    caseDocketEntries?: ResolveMotionDocketEntryIdParams['caseDocketEntries'];
  },
): Record<string, unknown> => {
  const motionDocketEntryIdFromStampData =
    (typeof stampData.docketEntryId === 'string' && stampData.docketEntryId) ||
    (typeof stampData.motionDocketEntryId === 'string' &&
      stampData.motionDocketEntryId) ||
    options?.motionDocketEntryId ||
    null;

  const draftOrderState: Record<string, unknown> = {
    additionalOrderText: translateAdditionalOrderText(stampData.customText),
    deniedAsMoot: stampData.deniedAsMoot ?? null,
    deniedWithoutPrejudice: stampData.deniedWithoutPrejudice ?? null,
    disposition: stampData.disposition ?? null,
    dueDate: translateDueDate(stampData.date),
    dueDateMessage: translateDueDateMessage(stampData.dueDateMessage),
    jurisdiction: translateJurisdiction(stampData.jurisdictionalOption),
    orderType: GRANT_DENY_MOTION_OPTIONS.orderType,
    strickenFromTrialSession:
      typeof stampData.strickenFromTrialSession === 'string' &&
      stampData.strickenFromTrialSession.trim() !== ''
        ? true
        : null,
  };

  const resolvedMotionDocketEntryId =
    options?.stampedOrderDocketEntryId && options.caseDocketEntries
      ? resolveMotionDocketEntryIdForStampedOrder({
          caseDocketEntries: options.caseDocketEntries,
          documentTitle: options.documentTitle,
          freeText: options.freeText,
          motionDocketEntryIdFromStampData,
          previousDocumentDocketEntryId: options.previousDocumentDocketEntryId,
          stampedOrderDocketEntryId: options.stampedOrderDocketEntryId,
        })
      : motionDocketEntryIdFromStampData ||
        options?.previousDocumentDocketEntryId;

  if (resolvedMotionDocketEntryId) {
    draftOrderState.previousDocument = {
      docketEntryId: resolvedMotionDocketEntryId,
    };
  }

  return Object.fromEntries(
    Object.entries(draftOrderState).filter(([, value]) => value !== null),
  );
};
