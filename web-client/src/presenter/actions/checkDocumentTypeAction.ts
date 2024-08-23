import {
  PRACTITIONER_DOCUMENT_TYPES_MAP,
  STATUS_REPORT_ORDER_OPTIONS,
} from '../../../../shared/src/business/entities/EntityConstants';

export const checkDocumentTypeAction = ({ path, props }: ActionProps) => {
  const { caseDetail, docketEntryIdToEdit, documentType, parentMessageId } =
    props;

  const parentMessagePath = parentMessageId ? `/${parentMessageId}` : '';

  const basePath = `/case-detail/${caseDetail.docketNumber}`;

  const [docketEntry] = (props.caseDetail.docketEntries || []).filter(
    de => de.docketEntryId === docketEntryIdToEdit,
  );

  const draftStatusReportOrderTypes = Object.values(
    STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions,
  );

  const isDraftStatusReportOrder = draftStatusReportOrderTypes.includes(
    docketEntry?.draftOrderState.orderType || '',
  );

  const isMiscellaneousDocument =
    documentType === PRACTITIONER_DOCUMENT_TYPES_MAP.MISCELLANEOUS ||
    (!isDraftStatusReportOrder && !documentType);

  const documentPath = isMiscellaneousDocument
    ? `/edit-upload-court-issued/${docketEntryIdToEdit}${parentMessagePath}`
    : `/edit-order/${docketEntryIdToEdit}${parentMessagePath}`;

  return isMiscellaneousDocument
    ? path.documentTypeMiscellaneous({ path: `${basePath}${documentPath}` })
    : path.documentTypeOrder({ path: `${basePath}${documentPath}` });
};
