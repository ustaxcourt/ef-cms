import { state } from '@web-client/presenter/app.cerebral';

export const batchGetMostRecentMessageInThreadAction = ({
  get,
}: ActionProps): { mostRecentMessages: string[] } => {
  const selectedMessages = get(state.messagesPage.selectedMessages);
  const latestMessagesInThreads = [];
  for (const message of selectedMessages) {
    latestMessagesInThreads.push(message);
  }
  return { mostRecentMessages: latestMessagesInThreads };
};
