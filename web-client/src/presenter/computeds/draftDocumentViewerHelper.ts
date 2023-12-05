import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const draftDocumentViewerHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const {
    EVENT_CODES_REQUIRING_SIGNATURE,
    GENERIC_ORDER_EVENT_CODE,
    NOTICE_EVENT_CODES,
    STIPULATED_DECISION_EVENT_CODE,
  } = applicationContext.getConstants();
  const user = applicationContext.getCurrentUser();
  const permissions = get(state.permissions);
  const caseDetail = get(state.caseDetail);

  const formattedCaseDetail = applicationContext
    .getUtilities()
    .getFormattedCaseDetail({
      applicationContext,
      caseDetail,
    });

  const viewerDraftDocumentToDisplayDocketEntryId = get(
    state.viewerDraftDocumentToDisplay.docketEntryId,
  );

  const formattedDocumentToDisplay =
    viewerDraftDocumentToDisplayDocketEntryId &&
    formattedCaseDetail.draftDocuments &&
    formattedCaseDetail.draftDocuments.find(
      draftDocument =>
        draftDocument.docketEntryId ===
        viewerDraftDocumentToDisplayDocketEntryId,
    );

  if (!formattedDocumentToDisplay) {
    return {
      createdByLabel: '',
      documentTitle: '',
    };
  }

  const documentRequiresSignature = EVENT_CODES_REQUIRING_SIGNATURE.includes(
    formattedDocumentToDisplay.eventCode,
  );

  const isNotice = NOTICE_EVENT_CODES.includes(
    formattedDocumentToDisplay.eventCode,
  );

  const isStipulatedDecision =
    formattedDocumentToDisplay.eventCode === STIPULATED_DECISION_EVENT_CODE;

  const documentIsSigned = !!formattedDocumentToDisplay.signedAt;

  const createdByLabel = formattedDocumentToDisplay.filedBy
    ? `Created by ${formattedDocumentToDisplay.filedBy}`
    : '';

  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  const hasDocketEntryPermission = permissions.CREATE_ORDER_DOCKET_ENTRY;

  const showAddDocketEntryButtonForRole = hasDocketEntryPermission;
  const showEditButtonForRole = isInternalUser;
  const showApplyRemoveSignatureButtonForRole = isInternalUser;

  const isDraftStampOrder =
    formattedDocumentToDisplay.eventCode === GENERIC_ORDER_EVENT_CODE &&
    formattedDocumentToDisplay.stampData?.disposition;

  const showEditButtonSigned =
    showEditButtonForRole &&
    documentIsSigned &&
    !isNotice &&
    !isStipulatedDecision &&
    !isDraftStampOrder;

  const showAddDocketEntryButtonForDocument =
    documentIsSigned ||
    !EVENT_CODES_REQUIRING_SIGNATURE.includes(
      formattedDocumentToDisplay.eventCode,
    );

  const showApplySignatureButtonForDocument = !documentIsSigned;
  const showRemoveSignatureButtonForDocument =
    documentIsSigned && !isNotice && !isStipulatedDecision;

  const showDocumentNotSignedAlert =
    documentRequiresSignature && !documentIsSigned;

  return {
    addDocketEntryLink: `/case-detail/${caseDetail.docketNumber}/documents/${viewerDraftDocumentToDisplayDocketEntryId}/add-court-issued-docket-entry`,
    applySignatureLink: `/case-detail/${caseDetail.docketNumber}/edit-order/${viewerDraftDocumentToDisplayDocketEntryId}/sign`,
    createdByLabel,
    documentTitle: formattedDocumentToDisplay.documentTitle,
    showAddDocketEntryButton:
      showAddDocketEntryButtonForRole && showAddDocketEntryButtonForDocument,
    showApplySignatureButton:
      showApplyRemoveSignatureButtonForRole &&
      showApplySignatureButtonForDocument,
    showDocumentNotSignedAlert,
    showEditButtonNotSigned:
      showEditButtonForRole && (!documentIsSigned || isNotice),
    showEditButtonSigned,
    showRemoveSignatureButton:
      showApplyRemoveSignatureButtonForRole &&
      showRemoveSignatureButtonForDocument &&
      !isDraftStampOrder,
  };
};
