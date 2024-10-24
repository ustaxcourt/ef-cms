import {
  MessageColumnData,
  MessageFilterData,
  MessageList,
} from '@web-client/views/Messages/MessageList';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const columns: MessageColumnData[] = [
  {
    columnName: 'Docket No.',
    dataTestId: 'message-individual-docket-number',
    iconClassName: 'consolidated-case-column',
    sortField: 'docketNumber',
  },
  {
    columnName: 'Received',
    dataTestId: 'message-individual-received',
    sortField: 'createdAt',
  },
  {
    columnName: 'Message',
    dataTestId: 'message-individual-subject',
    iconClassName: 'message-unread-column',
    sortField: 'subject',
  },
  {
    columnName: 'Case Title',
    dataTestId: 'message-individual-case-title',
    sortField: 'caseTitle',
  },
  {
    columnName: 'Case Status',
    dataTestId: 'message-individual-case-status',
    sortField: 'caseStatus',
  },
  {
    columnName: 'From',
    dataTestId: 'message-individual-from',
    sortField: 'from',
  },
  {
    columnName: 'Section',
    dataTestId: 'message-individual-section',
    sortField: 'fromSectionFormatted',
  },
];

export const MessagesIndividualInbox = connect(
  {
    batchCompleteMessageSequence: sequences.batchCompleteMessageSequence,
    constants: state.constants,
    formattedMessages: state.formattedMessages,
    messagesIndividualInboxHelper: state.messagesIndividualInboxHelper,
    screenMetadata: state.screenMetadata,
    setSelectedMessagesSequence: sequences.setSelectedMessagesSequence,
    sortTableSequence: sequences.sortTableSequence,
    tableSort: state.tableSort,
    updateMessageFilterSequence: sequences.updateMessageFilterSequence,
  },
  function MessagesIndividualInbox({ formattedMessages, screenMetadata }) {
    const filters: MessageFilterData[] = [
      {
        isSelected: screenMetadata.caseStatus,
        key: 'caseStatus',
        label: 'Case Status',
        options: formattedMessages.caseStatuses,
      },
      {
        isSelected: screenMetadata.fromUser,
        key: 'fromUser',
        label: 'From',
        options: formattedMessages.fromUsers,
      },
      {
        isSelected: screenMetadata.fromSection,
        key: 'fromSection',
        label: 'Section',
        options: formattedMessages.fromSections,
      },
    ];

    return (
      <MessageList
        messageColumns={columns}
        messageFilters={filters}
        selectable={true}
      />
    );
  },
);

MessagesIndividualInbox.displayName = 'MessagesIndividualInbox';
