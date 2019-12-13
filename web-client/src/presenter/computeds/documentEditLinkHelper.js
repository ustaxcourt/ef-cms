import { state } from 'cerebral';

export const documentEditLinkHelper = (get, applicationContext) => ({
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
    const userIsDocketClerk = userRole === USER_ROLES.docketClerk;
    const userIsPetitionsClerk = userRole === USER_ROLES.petitionsClerk;
    const boxIsOutbox = box === 'outbox';

    let linkToMessagesTab = workQueueIsInternal || userIsDocketClerk;

    linkToMessagesTab =
      linkToMessagesTab ||
      (!workQueueIsInternal && userIsPetitionsClerk && boxIsOutbox);

    return messageId && linkToMessagesTab;
  };

  const markReadPath = workItemIdToMarkAsRead
    ? `/mark/${workItemIdToMarkAsRead}`
    : '';

  if (shouldLinkToComplete) {
    return '/complete';
  } else if (shouldLinkToEditCourtIssued) {
    return '/edit-court-issued';
  } else if (shouldLinkToEdit) {
    return '/edit';
  } else if (shouldLinkToMessagesTab()) {
    return `/messages/${messageId}${markReadPath}`;
  } else {
    return `${markReadPath}`;
  }
};
