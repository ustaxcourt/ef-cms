import {
  MessageColumnData,
  SORTABLE_COLUMNS,
} from '@web-client/views/Messages/MessageColumns';
import { MessageList } from '@web-client/views/Messages/MessageList';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const columns: MessageColumnData[] = [
  SORTABLE_COLUMNS.DOCKET_NUMBER,
  SORTABLE_COLUMNS.RECEIVED,
  SORTABLE_COLUMNS.MESSAGE,
  SORTABLE_COLUMNS.CASE_TITLE,
  SORTABLE_COLUMNS.CASE_STATUS,
  SORTABLE_COLUMNS.TO,
  SORTABLE_COLUMNS.FROM,
  SORTABLE_COLUMNS.FROM_SECTION,
];

export const MessagesSectionInbox = connect(
  {
    formattedMessages: state.formattedMessages,
    screenMetadata: state.screenMetadata,
  },
  function MessagesSectionInbox({ formattedMessages, screenMetadata }) {
    const filters = [
      {
        isSelected: screenMetadata.caseStatus,
        key: 'caseStatus',
        label: 'Case Status',
        options: formattedMessages.caseStatuses,
      },
      {
        isSelected: screenMetadata.toUser,
        key: 'toUser',
        label: 'To',
        options: formattedMessages.toUsers,
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
        selectable={false}
      />
    );
  },
);

MessagesSectionInbox.displayName = 'MessagesSectionInbox';
