import { state } from 'cerebral';

export const documentEditLinkHelper = (get, applicationContext) => ({
  docketNumber,
  documentId,
  messageId,
  shouldLinkedToDetails,
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
    const userIsDocketClerk = userRole === USER_ROLES.docketClerk;
    const userIsPetitionsClerk = userRole === USER_ROLES.petitionsClerk;
    const boxIsOutbox = box === 'outbox';

    let linkToMessagesTab = workQueueIsInternal || userIsDocketClerk;

    linkToMessagesTab =
      linkToMessagesTab ||
      (!workQueueIsInternal && userIsPetitionsClerk && boxIsOutbox);

    return messageId && linkToMessagesTab;
  };

  const baseUri = `/case-detail/${docketNumber}/documents/${documentId}`;
  const markReadPath = workItemIdToMarkAsRead
    ? `/mark/${workItemIdToMarkAsRead}`
    : '';

  if (shouldLinkedToDetails) {
    return `${baseUri}`;
  } else if (shouldLinkToComplete) {
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
