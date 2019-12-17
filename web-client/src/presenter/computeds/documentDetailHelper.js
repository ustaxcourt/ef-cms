import { formatWorkItem } from './formattedWorkQueue';
import { orderBy } from 'lodash';
import { state } from 'cerebral';

export const formatDocumentWorkItems = ({ applicationContext, workItems }) => {
  const allWorkItems = orderBy(workItems, 'createdAt', 'desc').filter(
    workItem => !workItem.hideFromPendingMessages,
  );
  const incompleteWorkItems = allWorkItems
    .filter(items => !items.completedAt)
    .map(items =>
      formatWorkItem({
        applicationContext,
        workItem: items,
      }),
    );
  const completedWorkItems = allWorkItems
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
  const qcWorkItem = allWorkItems.filter(item => !item.isInternal)[0];

  return { completedWorkItems, incompleteWorkItems, qcWorkItem };
};

export const documentDetailHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  const {
    COURT_ISSUED_EVENT_CODES,
    ORDER_TYPES_MAP,
    STATUS_TYPES,
    USER_ROLES,
  } = applicationContext.getConstants();
  const orderDocumentTypes = ORDER_TYPES_MAP.map(
    orderType => orderType.documentType,
  );
  const courtIssuedDocumentTypes = COURT_ISSUED_EVENT_CODES.map(
    courtIssuedDoc => courtIssuedDoc.documentType,
  );
  const STIPULATED_DECISION_DOCUMENT_TYPE = 'Stipulated Decision';
  const newOrRecalledStatus = [STATUS_TYPES.new, STATUS_TYPES.recalled];

  const caseDetail = get(state.caseDetail);
  const permissions = get(state.permissions);
  const documentId = get(state.documentId);
  const document = caseDetail.documents.find(
    item => item.documentId === documentId,
  );
  if (!document) {
    return;
  }

  const formattedDocument = applicationContext
    .getUtilities()
    .formatDocument(applicationContext, document);

  const {
    completedWorkItems,
    incompleteWorkItems,
    qcWorkItem,
  } = formatDocumentWorkItems({
    applicationContext,
    workItems: formattedDocument.workItems,
  });
  formattedDocument.completedWorkItems = completedWorkItems;
  formattedDocument.workItems = incompleteWorkItems;

  if (formattedDocument.qcByUser) {
    formattedDocument.qcInfo = {
      date: applicationContext
        .getUtilities()
        .formatDateString(formattedDocument.qcAt, 'MMDDYY'),
      name: formattedDocument.qcByUser.name,
    };
  } else if (qcWorkItem && qcWorkItem.completedAt) {
    formattedDocument.qcInfo = {
      date: applicationContext
        .getUtilities()
        .formatDateString(qcWorkItem.completedAt, 'MMDDYY'),
      name: qcWorkItem.completedBy,
    };
  }

  const isStipDecision =
    document.documentType === STIPULATED_DECISION_DOCUMENT_TYPE;

  formattedDocument.signUrl = isStipDecision
    ? `/case-detail/${caseDetail.docketNumber}/documents/${formattedDocument.documentId}/sign`
    : `/case-detail/${caseDetail.docketNumber}/edit-order/${formattedDocument.documentId}/sign`;

  formattedDocument.editUrl = isStipDecision
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

  const showSignDocumentButton =
    permissions.COURT_ISSUED_DOCUMENT &&
    !!stipulatedWorkItem &&
    !signedDocument;

  const isSigned = !!document.signedAt;
  const isNotServed = !document.servedAt;
  const isDocumentOnDocketRecord = caseDetail.docketRecord.find(
    docketEntry => docketEntry.documentId === document.documentId,
  );
  const isOrder = orderDocumentTypes.includes(document.documentType);
  const isCourtIssuedDocument = courtIssuedDocumentTypes.includes(
    document.documentType,
  );
  const isDraftDocument =
    isNotServed &&
    (isStipDecision ||
      (isOrder && !isDocumentOnDocketRecord) ||
      (isCourtIssuedDocument && !isDocumentOnDocketRecord));

  const showServeToIrsButton =
    newOrRecalledStatus.includes(caseDetail.status) &&
    formattedDocument.isPetition &&
    user.role === USER_ROLES.petitionsClerk;
  const showRecallButton =
    caseDetail.status === STATUS_TYPES.batchedForIRS &&
    formattedDocument.isPetition;

  const showCaseDetailsEdit = newOrRecalledStatus.includes(caseDetail.status);
  const showCaseDetailsView = [STATUS_TYPES.batchedForIRS].includes(
    caseDetail.status,
  );
  const showDocumentInfoTab =
    formattedDocument.isPetition &&
    (showCaseDetailsEdit || showCaseDetailsView);

  const showViewOrdersNeededButton =
    (document.status === 'served' ||
      caseDetail.status === STATUS_TYPES.batchedForIRS) &&
    user.role === USER_ROLES.petitionsClerk;

  const showPrintCaseConfirmationButton =
    document.status === 'served' && formattedDocument.isPetition === true;

  const showAddDocketEntryButton = permissions.DOCKET_ENTRY && isDraftDocument;

  return {
    createdFiledLabel: isOrder ? 'Created' : 'Filed', // Should actually be all court-issued documents
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
    showCreatedFiled: (!isOrder && !isCourtIssuedDocument) || isDraftDocument,
    showDocumentInfoTab,
    showEditDocketEntry:
      !isDraftDocument &&
      permissions.DOCKET_ENTRY &&
      formattedDocument.isPetition === false,
    showPrintCaseConfirmationButton,
    showRecallButton,
    showRemoveSignature: isOrder && isSigned,
    showServeToIrsButton,
    showSignDocumentButton,
    showViewOrdersNeededButton,
  };
};
