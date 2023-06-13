import { DocketEntry } from '../../../../shared/src/business/entities/DocketEntry';

export const getShowNotServedForDocument = ({
  caseDetail,
  docketEntryId,
  draftDocuments,
  UNSERVABLE_EVENT_CODES,
}) => {
  let showNotServed = false;

  const caseDocument = caseDetail.docketEntries.find(
    doc => doc.docketEntryId === docketEntryId,
  );

  if (caseDocument) {
    const isUnservable = UNSERVABLE_EVENT_CODES.includes(
      caseDocument.eventCode,
    );

    const isDraftDocument =
      draftDocuments &&
      !!draftDocuments.find(draft => draft.docketEntryId === docketEntryId);

    showNotServed =
      !isUnservable && !DocketEntry.isServed(caseDocument) && !isDraftDocument;
  }

  return showNotServed;
};
