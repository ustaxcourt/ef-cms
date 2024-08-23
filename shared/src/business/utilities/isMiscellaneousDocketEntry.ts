import {
  PRACTITIONER_DOCUMENT_TYPES_MAP,
  STATUS_REPORT_ORDER_OPTIONS,
} from '../entities/EntityConstants';

export const isMiscellaneousDocketEntry = (
  docketEntry: RawDocketEntry,
): boolean => {
  const draftStatusReportOrderTypes = Object.values(
    STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions,
  );

  const isDraftStatusReportOrder = draftStatusReportOrderTypes.includes(
    docketEntry?.draftOrderState?.orderType || '',
  );

  return (
    docketEntry.documentType ===
      PRACTITIONER_DOCUMENT_TYPES_MAP.MISCELLANEOUS ||
    (!isDraftStatusReportOrder && !docketEntry.documentType)
  );
};
