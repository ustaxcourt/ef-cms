import { isMiscellaneousDocketEntry } from '@shared/business/utilities/isMiscellaneousDocketEntry';

export const checkDocumentTypeAction = ({ path, props }: ActionProps) => {
  const { caseDetail, docketEntryIdToEdit, parentMessageId } = props;

  const [docketEntry] = (props.caseDetail.docketEntries || []).filter(
    de => de.docketEntryId === docketEntryIdToEdit,
  );

  const routeToEditUploadCourtIssued = isMiscellaneousDocketEntry(docketEntry);

  const parentMessagePath = parentMessageId ? `/${parentMessageId}` : '';

  return routeToEditUploadCourtIssued
    ? path.documentTypeMiscellaneous({
        path: `/case-detail/${caseDetail.docketNumber}/edit-upload-court-issued/${docketEntryIdToEdit}${parentMessagePath}`,
      })
    : path.documentTypeOrder({
        path: `/case-detail/${caseDetail.docketNumber}/edit-order/${docketEntryIdToEdit}${parentMessagePath}`,
      });
};
