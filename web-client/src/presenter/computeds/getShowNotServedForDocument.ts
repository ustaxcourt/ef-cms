import { computeIsNotServedDocument } from '@shared/business/utilities/getFormattedCaseDetail';

export const getShowNotServedForDocument = ({
  caseDetail,
  docketEntryId,
}: {
  caseDetail: RawCase;
  docketEntryId: string;
}) => {
  let showNotServed = false;

  const caseDocument = caseDetail.docketEntries.find(
    doc => doc.docketEntryId === docketEntryId,
  );

  if (caseDocument) {
    const isDraftDocument = caseDocument.isDraft && !caseDocument.archived;

    showNotServed =
      !isDraftDocument &&
      computeIsNotServedDocument({
        formattedEntry: caseDocument,
      });
  }

  return showNotServed;
};
