import {
  MessageColumnData,
  SORTABLE_COLUMNS,
} from '@web-client/views/Messages/MessageColumns';
import { MessageTable } from '@web-client/views/Messages/MessageTable';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const columns: MessageColumnData[] = [
  SORTABLE_COLUMNS.DOCKET_NUMBER,
  SORTABLE_COLUMNS.SENT,
  SORTABLE_COLUMNS.MESSAGE,
  SORTABLE_COLUMNS.CASE_TITLE,
  SORTABLE_COLUMNS.CASE_STATUS,
  SORTABLE_COLUMNS.TO,
  SORTABLE_COLUMNS.FROM,
  SORTABLE_COLUMNS.TO_SECTION,
];

export const MessagesSectionOutbox = connect(
  {
    formattedMessages: state.formattedMessages,
    screenMetadata: state.screenMetadata,
  },
  function MessagesSectionOutbox({ formattedMessages, screenMetadata }) {
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
        isSelected: screenMetadata.toSection,
        key: 'toSection',
        label: 'Section',
        options: formattedMessages.toSections,
      },
    ];
    return (
      <MessageTable
        id="messages-section-outbox"
        messageColumns={columns}
        messageFilters={filters}
        selectable={false}
      />
    );
  },
);

MessagesSectionOutbox.displayName = 'MessagesSectionOutbox';
