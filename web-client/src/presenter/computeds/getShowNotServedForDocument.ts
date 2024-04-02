import { computeIsNotServedDocument } from '@shared/business/utilities/getFormattedCaseDetail';

export const getShowNotServedForDocument = ({
  caseDetail,
  docketEntryId,
  draftDocuments = [],
}: {
  caseDetail: RawCase;
  docketEntryId: string;
  draftDocuments?: RawDocketEntry[];
}) => {
  let showNotServed = false;

  const caseDocument = caseDetail.docketEntries.find(
    doc => doc.docketEntryId === docketEntryId,
  );

  if (caseDocument) {
    const isDraftDocument =
      draftDocuments &&
      !!draftDocuments.find(draft => draft.docketEntryId === docketEntryId);

    showNotServed =
      !isDraftDocument &&
      computeIsNotServedDocument({
        formattedEntry: caseDocument,
      });
  }

  return showNotServed;
};
