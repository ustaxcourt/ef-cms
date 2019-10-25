import { formatWorkItem } from './formattedWorkQueue';
import { state } from 'cerebral';
import _ from 'lodash';

export const documentDetailHelper = (get, applicationContext) => {
  const user = applicationContext.getCurrentUser();
  let showSignDocumentButton = false;
  const caseDetail = get(state.caseDetail);
  const USER_ROLES = get(state.constants.USER_ROLES);
  const permissions = get(state.permissions);

  const SIGNED_STIPULATED_DECISION = 'Stipulated Decision';

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
          USER_ROLES,
          applicationContext,
          workItem: items,
        }),
      );
    formattedDocument.completedWorkItems = (allWorkItems || [])
      .filter(items => items.completedAt)
      .map(items => {
        const formatted = formatWorkItem({
          USER_ROLES,
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
      formattedDocument.documentType === 'Stipulated Decision'
        ? `/case-detail/${caseDetail.docketNumber}/documents/${formattedDocument.documentId}/sign`
        : `/case-detail/${caseDetail.docketNumber}/edit-order/${formattedDocument.documentId}/sign`;

    formattedDocument.editUrl =
      formattedDocument.documentType === 'Stipulated Decision'
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
      doc => doc.documentType === SIGNED_STIPULATED_DECISION && !doc.archived,
    );

    showSignDocumentButton =
      permissions.COURT_ISSUED_DOCUMENT &&
      !!stipulatedWorkItem &&
      !signedDocument;

    showServeDocumentButton =
      permissions.SERVE_DOCUMENT &&
      document.status !== 'served' &&
      document.documentType === SIGNED_STIPULATED_DECISION;

    const { ORDER_TYPES_MAP } = applicationContext.getConstants();

    isSigned = !!document.signedAt;
    isStipDecision = document.documentType === 'Stipulated Decision';
    isOrder = !!ORDER_TYPES_MAP.find(
      order => order.documentType === document.documentType,
    );
    isDraftDocument =
      (isStipDecision && !isSigned) || (!document.servedAt && isOrder);

    if (isDraftDocument) {
      documentEditUrl =
        document.documentType === 'Stipulated Decision'
          ? `/case-detail/${caseDetail.docketNumber}/documents/${document.documentId}/sign`
          : `/case-detail/${caseDetail.docketNumber}/edit-order/${document.documentId}`;
    }

    showServeToIrsButton =
      ['New', 'Recalled'].includes(caseDetail.status) &&
      formattedDocument.isPetition;
    showRecallButton =
      caseDetail.status === 'Batched for IRS' && formattedDocument.isPetition;
  }

  const formattedDocumentIsPetition =
    (formattedDocument && formattedDocument.isPetition) || false;
  const showCaseDetailsEdit = ['New', 'Recalled'].includes(caseDetail.status);
  const showCaseDetailsView = ['Batched for IRS'].includes(caseDetail.status);
  const showDocumentInfoTab =
    formattedDocumentIsPetition && (showCaseDetailsEdit || showCaseDetailsView);

  const showDocumentViewerTopMargin =
    !showServeDocumentButton &&
    (!showSignDocumentButton &&
      (!['New', 'Recalled'].includes(caseDetail.status) ||
        !formattedDocument.isPetition));

  const showViewOrdersNeededButton =
    ((document && document.status === 'served') ||
      caseDetail.status === 'Batched for IRS') &&
    user.role === USER_ROLES.petitionsClerk;

  return {
    documentEditUrl,
    formattedDocument,
    isDraftDocument,
    showAction: (action, workItemId) => {
      const actions = get(state.workItemActions);
      return actions[workItemId] === action;
    },
    showCaseDetailsEdit,
    showCaseDetailsView,
    showConfirmEditOrder: isSigned && isOrder,
    showDocumentInfoTab,
    showDocumentViewerTopMargin,
    showRecallButton,
    showRemoveSignature: isOrder && isSigned,
    showServeDocumentButton,
    showServeToIrsButton,
    showSignDocumentButton,
    showViewOrdersNeededButton,
  };
};
