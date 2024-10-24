import {
  COLUMN_NAMES,
  MessageColumnData,
  getColumnData,
} from '@web-client/views/Messages/MessageColumns';
import { MessageList } from '@web-client/views/Messages/MessageList';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const columns: MessageColumnData[] = getColumnData([
  COLUMN_NAMES.DOCKET_NUMBER,
  COLUMN_NAMES.SENT,
  COLUMN_NAMES.MESSAGE,
  COLUMN_NAMES.CASE_TITLE,
  COLUMN_NAMES.CASE_STATUS,
  COLUMN_NAMES.TO,
  COLUMN_NAMES.SECTION,
]);

export const MessagesIndividualOutbox = connect(
  {
    formattedMessages: state.formattedMessages,
    screenMetadata: state.screenMetadata,
  },
  function MessagesIndividualOutbox({ formattedMessages, screenMetadata }) {
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
        isSelected: screenMetadata.toSection,
        key: 'toSection',
        label: 'Section',
        options: formattedMessages.toSections,
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

MessagesIndividualOutbox.displayName = 'MessagesIndividualOutbox';
