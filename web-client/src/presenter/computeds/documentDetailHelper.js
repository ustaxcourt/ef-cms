import { formatWorkItem } from './formattedWorkQueue';
import { state } from 'cerebral';
import _ from 'lodash';

export const documentDetailHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  let showSignDocumentButton = false;
  const caseDetail = get(state.caseDetail);
  const { STATUS_TYPES, USER_ROLES } = get(state.constants);
  const permissions = get(state.permissions);

  const STIPULATED_DECISION_DOCUMENT_TYPE = 'Stipulated Decision';
  const newOrRecalledStatus = [STATUS_TYPES.new, STATUS_TYPES.recalled];

  let showServeDocumentButton = false;

  const documentId = get(state.documentId);
  let isDraftDocument = false;
  const document = (caseDetail.documents || []).find(
    item => item.documentId === documentId,
  );
  let formattedDocument = {};
  let documentEditUrl;
  let isSigned = false;
  let isStipDecision = false;
  let isOrder = false;

  let showServeToIrsButton = false;
  let showRecallButton = false;

  if (document) {
    // TODO: why do we need to check if document exists when it should always exist
    formattedDocument = applicationContext
      .getUtilities()
      .formatDocument(applicationContext, document);
    const allWorkItems = _.orderBy(
      formattedDocument.workItems,
      'createdAt',
      'desc',
    );
    formattedDocument.workItems = (allWorkItems || [])
      .filter(items => !items.completedAt)
      .map(items =>
        formatWorkItem({
          applicationContext,
          workItem: items,
        }),
      );
    formattedDocument.completedWorkItems = (allWorkItems || [])
      .filter(items => items.completedAt)
      .map(items => {
        const formatted = formatWorkItem({
          applicationContext,
          workItem: items,
        });
        formatted.messages = formatted.messages.filter(
          message => !message.message.includes('Served on IRS'),
        );
        return formatted;
      });
    const qcItem = (allWorkItems || []).filter(item => !item.isInternal)[0];

    if (formattedDocument.qcByUser) {
      formattedDocument.qcInfo = {
        date: applicationContext
          .getUtilities()
          .formatDateString(formattedDocument.qcAt, 'MMDDYY'),
        name: formattedDocument.qcByUser.name,
      };
    } else if (qcItem && qcItem.completedAt) {
      formattedDocument.qcInfo = {
        date: applicationContext
          .getUtilities()
          .formatDateString(qcItem.completedAt, 'MMDDYY'),
        name: qcItem.completedBy,
      };
    }

    formattedDocument.signUrl =
      formattedDocument.documentType === STIPULATED_DECISION_DOCUMENT_TYPE
        ? `/case-detail/${caseDetail.docketNumber}/documents/${formattedDocument.documentId}/sign`
        : `/case-detail/${caseDetail.docketNumber}/edit-order/${formattedDocument.documentId}/sign`;

    formattedDocument.editUrl =
      formattedDocument.documentType === STIPULATED_DECISION_DOCUMENT_TYPE
        ? `/case-detail/${caseDetail.docketNumber}/documents/${formattedDocument.documentId}/sign`
        : `/case-detail/${caseDetail.docketNumber}/edit-order/${formattedDocument.documentId}`;

    const stipulatedWorkItem = formattedDocument.workItems.find(
      workItem =>
        workItem.document.documentType === 'Proposed Stipulated Decision' &&
        workItem.assigneeId === user.userId &&
        !workItem.completedAt,
    );

    // Check all documents associated with the case
    // to see if there is a signed stip decision
    const signedDocument = caseDetail.documents.find(
      doc =>
        doc.documentType === STIPULATED_DECISION_DOCUMENT_TYPE && !doc.archived,
    );

    showSignDocumentButton =
      permissions.COURT_ISSUED_DOCUMENT &&
      !!stipulatedWorkItem &&
      !signedDocument;

    showServeDocumentButton =
      permissions.SERVE_DOCUMENT &&
      document.status !== 'served' &&
      document.documentType === STIPULATED_DECISION_DOCUMENT_TYPE;

    const { ORDER_TYPES_MAP } = applicationContext.getConstants();

    isSigned = !!document.signedAt;
    isStipDecision =
      document.documentType === STIPULATED_DECISION_DOCUMENT_TYPE;
    isOrder = !!ORDER_TYPES_MAP.find(
      order => order.documentType === document.documentType,
    );
    isDraftDocument =
      (isStipDecision && !isSigned) || (!document.servedAt && isOrder);

    if (isDraftDocument) {
      documentEditUrl =
        document.documentType === STIPULATED_DECISION_DOCUMENT_TYPE
          ? `/case-detail/${caseDetail.docketNumber}/documents/${document.documentId}/sign`
          : `/case-detail/${caseDetail.docketNumber}/edit-order/${document.documentId}`;
    }

    showServeToIrsButton =
      newOrRecalledStatus.includes(caseDetail.status) &&
      formattedDocument.isPetition &&
      user.role === USER_ROLES.petitionsClerk;
    showRecallButton =
      caseDetail.status === STATUS_TYPES.batchedForIRS &&
      formattedDocument.isPetition;
  }

  const formattedDocumentIsPetition =
    (formattedDocument && formattedDocument.isPetition) || false;
  const showCaseDetailsEdit = newOrRecalledStatus.includes(caseDetail.status);
  const showCaseDetailsView = [STATUS_TYPES.batchedForIRS].includes(
    caseDetail.status,
  );
  const showDocumentInfoTab =
    formattedDocumentIsPetition && (showCaseDetailsEdit || showCaseDetailsView);

  const showDocumentViewerTopMargin =
    !showServeDocumentButton &&
    !showSignDocumentButton &&
    (!newOrRecalledStatus.includes(caseDetail.status) ||
      !formattedDocument.isPetition);

  const showViewOrdersNeededButton =
    ((document && document.status === 'served') ||
      caseDetail.status === STATUS_TYPES.batchedForIRS) &&
    user.role === USER_ROLES.petitionsClerk;

  const showPrintCaseConfirmationButton =
    document &&
    document.status === 'served' &&
    formattedDocument.isPetition === true;

  const showAddDocketEntryButton = permissions.DOCKET_ENTRY && isDraftDocument;

  return {
    createdFiledLabel: isOrder ? 'Created' : 'Filed', // Should actually be all court-issued documents
    documentEditUrl,
    formattedDocument,
    isDraftDocument,
    showAction: (action, workItemId) => {
      const actions = get(state.workItemActions);
      return actions[workItemId] === action;
    },
    showAddDocketEntryButton,
    showCaseDetailsEdit,
    showCaseDetailsView,
    showConfirmEditOrder: isSigned && isOrder,
    showDocumentInfoTab,
    showDocumentViewerTopMargin,
    showEditDocketEntry:
      !isDraftDocument &&
      permissions.DOCKET_ENTRY &&
      formattedDocument.isPetition === false,
    showPrintCaseConfirmationButton,
    showRecallButton,
    showRemoveSignature: isOrder && isSigned,
    showServeDocumentButton,
    showServeToIrsButton,
    showSignDocumentButton,
    showViewOrdersNeededButton,
  };
};
