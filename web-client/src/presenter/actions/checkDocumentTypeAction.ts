import { PRACTITIONER_DOCUMENT_TYPES_MAP } from '../../../../shared/src/business/entities/EntityConstants';

export const checkDocumentTypeAction = ({ path, props }: ActionProps) => {
  const { caseDetail, docketEntryIdToEdit, documentType, parentMessageId } =
    props;

  const parentMessagePath = parentMessageId ? `/${parentMessageId}` : '';

  const basePath = `/case-detail/${caseDetail.docketNumber}`;

  const isMiscellaneousDocument =
    documentType === PRACTITIONER_DOCUMENT_TYPES_MAP.MISCELLANEOUS ||
    !documentType;

  const documentPath = isMiscellaneousDocument
    ? `/edit-upload-court-issued/${docketEntryIdToEdit}${parentMessagePath}`
    : `/edit-order/${docketEntryIdToEdit}${parentMessagePath}`;

  return isMiscellaneousDocument
    ? path.documentTypeMiscellaneous({ path: `${basePath}${documentPath}` })
    : path.documentTypeOrder({ path: `${basePath}${documentPath}` });
};
