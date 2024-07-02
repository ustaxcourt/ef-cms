export const checkDocumentTypeAction = ({ path, props }: ActionProps) => {
  if (props.documentType === 'Miscellaneous') {
    console.log('Miscellaneous');
    return path.documentTypeMiscellaneous({
      path: `/case-detail/${props.caseDetail.docketNumber}/edit-upload-court-issued/${props.docketEntryIdToEdit}`,
    });
  }

  console.log('edit order');
  return path.documentTypeOrder({
    path: `/case-detail/${props.caseDetail.docketNumber}/edit-order/${props.docketEntryIdToEdit}`,
  });
};
