import {
  MessageColumnData,
  SORTABLE_COLUMNS,
} from '@web-client/views/Messages/MessageColumns';
import {
  MessageFilterData,
  MessageTable,
} from '@web-client/views/Messages/MessageTable';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const columns: MessageColumnData[] = [
  SORTABLE_COLUMNS.DOCKET_NUMBER,
  SORTABLE_COLUMNS.RECEIVED,
  SORTABLE_COLUMNS.MESSAGE_WITH_UNREAD_ICON,
  SORTABLE_COLUMNS.CASE_TITLE,
  SORTABLE_COLUMNS.CASE_STATUS,
  SORTABLE_COLUMNS.FROM,
  SORTABLE_COLUMNS.FROM_SECTION,
];

export const MessagesIndividualInbox = connect(
  {
    formattedMessages: state.formattedMessages,
    screenMetadata: state.screenMetadata,
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
      <MessageTable
        id="messages-individual-inbox"
        messageColumns={columns}
        messageFilters={filters}
        selectable={true}
      />
    );
  },
);

MessagesIndividualInbox.displayName = 'MessagesIndividualInbox';
