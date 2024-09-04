import { PRACTITIONER_DOCUMENT_TYPES_MAP } from '../entities/EntityConstants';
import { isDraftStatusReportOrder } from './isDraftStatusReportOrder';

export const isMiscellaneousDocketEntry = (docketEntry): boolean => {
  return (
    docketEntry.documentType ===
      PRACTITIONER_DOCUMENT_TYPES_MAP.MISCELLANEOUS ||
    (!isDraftStatusReportOrder(docketEntry) && !docketEntry.documentType)
  );
};
