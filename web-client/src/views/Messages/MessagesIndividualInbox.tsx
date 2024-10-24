import {
  COLUMN_NAMES,
  MessageColumnData,
  getColumnData,
} from '@web-client/views/Messages/MessageColumns';
import {
  MessageFilterData,
  MessageList,
} from '@web-client/views/Messages/MessageList';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const columns: MessageColumnData[] = getColumnData([
  COLUMN_NAMES.DOCKET_NUMBER,
  COLUMN_NAMES.RECEIVED,
  COLUMN_NAMES.MESSAGE,
  COLUMN_NAMES.CASE_TITLE,
  COLUMN_NAMES.CASE_STATUS,
  COLUMN_NAMES.FROM,
  COLUMN_NAMES.SECTION,
]);

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
      <MessageList
        messageColumns={columns}
        messageFilters={filters}
        selectable={true}
      />
    );
  },
);

MessagesIndividualInbox.displayName = 'MessagesIndividualInbox';
