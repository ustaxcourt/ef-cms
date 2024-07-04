export const checkDocumentTypeAction = ({ path, props }: ActionProps) => {
  if (props.documentType === 'Miscellaneous') {
    return path.documentTypeMiscellaneous({
      path: `/case-detail/${props.caseDetail.docketNumber}/edit-upload-court-issued/${props.docketEntryIdToEdit}`,
    });
  }

  return path.documentTypeOrder({
    path: `/case-detail/${props.caseDetail.docketNumber}/edit-order/${props.docketEntryIdToEdit}`,
  });
};
