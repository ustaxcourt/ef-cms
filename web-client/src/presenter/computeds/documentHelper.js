import { state } from 'cerebral';

// Petition Clerk > Messages | My | Inbox > Message tab
// Petition Clerk > Messages | My | Sent > Message tab
// Petition Clerk > Messages | Section | Inbox > Message tab
// Petition Clerk > Messages | Section | Sent > Message tab
// Petition Clerk > Doc QC | My | Inbox > Doc Info tab (edit mode)
// Petition Clerk > Doc QC | My | Batched > Doc Info tab (read only mode)
// Petition Clerk > Doc QC | My | Served > Message tab (no doc info tab)
// Petition Clerk > Doc QC | Section | Inbox > Doc Info tab (edit mode)
// Petition Clerk > Doc QC | Section | Batched > Doc Info tab (read only mode)
// Petition Clerk > Doc QC | Section | Served > Message tab (no doc info tab)
//
// Docket Clerk > Messages | My | Inbox > Message tab (no doc info tab)
// Docket Clerk > Messages | My | Sent > Message tab (no doc info tab)
// Docket Clerk > Messages | Section | Inbox > Message tab (no doc info tab)
// Docket Clerk > Messages | Section | Sent > Message tab (no doc info tab)
// Docket Clerk > Doc QC | My | Inbox > Message tab (no doc info tab)
// Docket Clerk > Doc QC | My | Processed > Message tab (no doc info tab)
// Docket Clerk > Doc QC | Section | Inbox > Message tab (no doc info tab)
// Docket Clerk > Doc QC | Section | Processed > Message tab (no doc info tab) (edited)

const currentUser = get(state.user);
const userRole = currentUser.role;
const workQueueToDisplay = get(state.workQueueToDisplay);
const workQueueIsInternal = get(state.workQueueIsInternal);

const shouldMarkRead = (url, workItemId) => {
  return `${url}/mark/${workItemId}`;
};

const getBaseUri = (docketNumber, documentId) => {
  return `/case-detail/${docketNumber}/documents/${documentId}`;
};

const getTab = (url, messageId) => {
  if (messageId) {
    return `${url}/messages/${messageId}`;
  } else {
    return url;
  }
};

switch (userRole) {
  case 'petitionsclerk':
    let composedUri = getBaseUri(docketNumber, documentId);
    composedUri = getTab(composedUri);
    if (workItemIdToMarkAsRead) {
      composedUri = shouldMarkRead(composedUri);
    }
    return composedUri;
}

export const documentHelper = () => ({
  docketNumber,
  documentId,
  messageId,
  workItemIdToMarkAsRead,
}) => {
  const baseUri = `/case-detail/${docketNumber}/documents/${documentId}`;
  const markReadPath = workItemIdToMarkAsRead
    ? `/${workItemIdToMarkAsRead}`
    : '';
  if (messageId) {
    return `${baseUri}/messages/${messageId}${markReadPath}`;
  } else if (workItemIdToMarkAsRead) {
    return `${baseUri}/qc/${workItemIdToMarkAsRead}`;
  } else {
    return baseUri;
  }
};
