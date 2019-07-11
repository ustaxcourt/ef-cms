import { state } from 'cerebral';

export const documentHelper = get => ({
  docketNumber,
  documentId,
  messageId,
  workItemIdToMarkAsRead,
}) => {
  const currentUser = get(state.user);
  const userRole = currentUser.role;
  const { box } = get(state.workQueueToDisplay);
  const workQueueIsInternal = get(state.workQueueIsInternal);

  const shouldLinkToMessagesTab = () => {
    let linkToMessagesTab = false;
    if (userRole == 'docketclerk' || workQueueIsInternal) {
      linkToMessagesTab = true;
    } else if (
      userRole == 'petitionsclerk' &&
      !workQueueIsInternal &&
      box == 'outbox'
    ) {
      linkToMessagesTab = true;
    }

    return messageId && linkToMessagesTab;
  };

  const baseUri = `/case-detail/${docketNumber}/documents/${documentId}`;
  const markReadPath = workItemIdToMarkAsRead
    ? `/mark/${workItemIdToMarkAsRead}`
    : '';

  if (shouldLinkToMessagesTab()) {
    return `${baseUri}/messages/${messageId}${markReadPath}`;
  } else {
    return `${baseUri}${markReadPath}`;
  }
};
