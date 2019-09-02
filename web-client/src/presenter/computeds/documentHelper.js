import { state } from 'cerebral';

export const documentHelper = get => ({
  docketNumber,
  documentId,
  messageId,
  shouldLinkToEdit,
  workItemIdToMarkAsRead,
}) => {
  const currentUser = get(state.user);
  const userRole = currentUser.role;
  const { box } = get(state.workQueueToDisplay);
  const workQueueIsMessages = get(state.workQueueIsMessages);

  const shouldLinkToMessagesTab = () => {
    let linkToMessagesTab = false;
    if (userRole == 'docketclerk' || workQueueIsMessages) {
      linkToMessagesTab = true;
    } else if (
      userRole == 'petitionsclerk' &&
      !workQueueIsMessages &&
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

  if (shouldLinkToEdit) {
    return `${baseUri}/edit`;
  } else if (shouldLinkToMessagesTab()) {
    return `${baseUri}/messages/${messageId}${markReadPath}`;
  } else {
    return `${baseUri}${markReadPath}`;
  }
};
