import { state } from 'cerebral';

export const documentEditLinkHelper = (get, applicationContext) => ({
  docketNumber,
  documentId,
  messageId,
  shouldLinkToComplete,
  shouldLinkToEdit,
  shouldLinkToEditCourtIssued,
  workItemIdToMarkAsRead,
}) => {
  const currentUser = applicationContext.getCurrentUser();
  const userRole = currentUser.role;
  const { box, workQueueIsInternal } = get(state.workQueueToDisplay);
  const { USER_ROLES } = applicationContext.getConstants();

  const shouldLinkToMessagesTab = () => {
    let linkToMessagesTab = false;
    if (userRole === USER_ROLES.docketClerk || workQueueIsInternal) {
      linkToMessagesTab = true;
    } else if (
      userRole === USER_ROLES.petitionsClerk &&
      !workQueueIsInternal &&
      box === 'outbox'
    ) {
      linkToMessagesTab = true;
    }

    return messageId && linkToMessagesTab;
  };

  const baseUri = `/case-detail/${docketNumber}/documents/${documentId}`;
  const markReadPath = workItemIdToMarkAsRead
    ? `/mark/${workItemIdToMarkAsRead}`
    : '';

  if (shouldLinkToComplete) {
    return `${baseUri}/complete`;
  } else if (shouldLinkToEditCourtIssued) {
    return `${baseUri}/edit-court-issued`;
  } else if (shouldLinkToEdit) {
    return `${baseUri}/edit`;
  } else if (shouldLinkToMessagesTab()) {
    return `${baseUri}/messages/${messageId}${markReadPath}`;
  } else {
    return `${baseUri}${markReadPath}`;
  }
};
