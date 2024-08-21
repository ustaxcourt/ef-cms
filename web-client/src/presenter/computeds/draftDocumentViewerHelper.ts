/* eslint-disable complexity */

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { STATUS_REPORT_ORDER_OPTIONS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

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

  const viewerDraftDocumentToDisplayDocketEntryId = get(
    state.viewerDraftDocumentToDisplay.docketEntryId,
  );

  const formattedCaseDetail = applicationContext
    .getUtilities()
    .getFormattedCaseDetail({
      applicationContext,
      caseDetail,
    });

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

  const isInternalUser = applicationContext
    .getUtilities()
    .isInternalUser(user.role);

  const isDraftStampOrder =
    formattedDocumentToDisplay.eventCode === GENERIC_ORDER_EVENT_CODE &&
    formattedDocumentToDisplay.stampData?.disposition;

  const isStatusReportOrder = Object.values(
    STATUS_REPORT_ORDER_OPTIONS.orderTypeOptions,
  ).includes(formattedDocumentToDisplay?.draftOrderState?.orderType);

  const isNotice = NOTICE_EVENT_CODES.includes(
    formattedDocumentToDisplay.eventCode,
  );

  const isStipulatedDecision =
    formattedDocumentToDisplay.eventCode === STIPULATED_DECISION_EVENT_CODE;

  const requiresSignature = EVENT_CODES_REQUIRING_SIGNATURE.includes(
    formattedDocumentToDisplay.eventCode,
  );

  const isSigned = !!formattedDocumentToDisplay.signedAt;

  // begin draft document-specific variables
  const createdByLabel = formattedDocumentToDisplay.filedBy
    ? `Created by ${formattedDocumentToDisplay.filedBy}`
    : '';
  // end draft document-specific variables

  const showEditButtonForRole = isInternalUser;
  const showEditButtonSigned = isStatusReportOrder
    ? permissions.STATUS_REPORT_ORDER && isSigned
    : showEditButtonForRole &&
      isSigned &&
      !isNotice &&
      !isDraftStampOrder &&
      !isStipulatedDecision;
  const showEditButtonNotSigned = isStatusReportOrder
    ? permissions.STATUS_REPORT_ORDER && !isSigned
    : showEditButtonForRole && (!isSigned || isNotice);

  const showAddDocketEntryButtonForDocument = isSigned || !requiresSignature;
  const showAddDocketEntryButton =
    permissions.CREATE_ORDER_DOCKET_ENTRY &&
    showAddDocketEntryButtonForDocument;

  const showApplySignatureButtonForRole = isInternalUser;
  const showApplySignatureButtonForDocument = !isSigned;
  const showApplySignatureButton =
    showApplySignatureButtonForRole && showApplySignatureButtonForDocument;

  const showApplyRemoveSignatureButtonForRole = isInternalUser;
  const showRemoveSignatureButtonForDocument =
    isSigned && !isNotice && !isStipulatedDecision;
  const showRemoveSignatureButton =
    showApplyRemoveSignatureButtonForRole &&
    showRemoveSignatureButtonForDocument &&
    !isDraftStampOrder;

  const showDocumentNotSignedAlert = requiresSignature && !isSigned;

  const addDocketEntryLink = `/case-detail/${caseDetail.docketNumber}/documents/${viewerDraftDocumentToDisplayDocketEntryId}/add-court-issued-docket-entry`;
  const applySignatureLink = `/case-detail/${caseDetail.docketNumber}/edit-order/${viewerDraftDocumentToDisplayDocketEntryId}/sign`;

  return {
    addDocketEntryLink,
    applySignatureLink,
    createdByLabel,
    documentTitle: formattedDocumentToDisplay.documentTitle,
    showAddDocketEntryButton,
    showApplySignatureButton,
    showDocumentNotSignedAlert,
    showEditButtonNotSigned,
    showEditButtonSigned,
    showRemoveSignatureButton,
  };
};
