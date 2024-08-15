export const checkDocumentTypeAction = ({ path, props }: ActionProps) => {
  const parentMessageId = props.parentMessageId
    ? `/${props.parentMessageId}`
    : '';

  if (props.documentType === 'Miscellaneous') {
    return path.documentTypeMiscellaneous({
      path: `/case-detail/${props.caseDetail.docketNumber}/edit-upload-court-issued/${props.docketEntryIdToEdit}${parentMessageId}`,
    });
  }

  return path.documentTypeOrder({
    path: `/case-detail/${props.caseDetail.docketNumber}/edit-order/${props.docketEntryIdToEdit}${parentMessageId}`,
  });
};
