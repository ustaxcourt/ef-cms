import { RawMessage } from '@shared/business/entities/Message';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * moves the just-completed messages out of the docket clerk report's Inbox and
 * into its Completed box, mirroring the fields the server sets in
 * Message.markAsCompleted so the tables update without a re-fetch
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const moveDocketClerkReportMessagesToCompletedAction = ({
  get,
  props,
  store,
}: ActionProps<{ completedMessageIds: string[] }>): void => {
  const { completedMessageIds } = props;
  const selectedClerk = get(state.docketClerkReport.selectedClerk);
  const inboxMessages: RawMessage[] = get(
    state.docketClerkReport.inboxMessages,
  );
  const completedMessages: RawMessage[] = get(
    state.docketClerkReport.completedMessages,
  );

  const wasCompleted = (message: RawMessage): boolean =>
    completedMessageIds.includes(message.messageId);

  // The completion is attributed to the clerk whose inbox is being viewed, not
  // to the logged-in user running the report.
  const completedAt = createISODateString();
  const newlyCompleted = inboxMessages.filter(wasCompleted).map(message => ({
    ...message,
    completedAt,
    completedBy: selectedClerk?.name,
    completedByUserId: selectedClerk?.userId,
    completedBySection: selectedClerk?.section,
    completedMessage: null,
    isCompleted: true,
    isRepliedTo: true,
  }));

  store.set(
    state.docketClerkReport.inboxMessages,
    inboxMessages.filter(message => !wasCompleted(message)),
  );
  store.set(state.docketClerkReport.completedMessages, [
    ...newlyCompleted,
    ...completedMessages,
  ]);
};
