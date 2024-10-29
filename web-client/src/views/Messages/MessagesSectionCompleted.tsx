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
  SORTABLE_COLUMNS.COMPLETED_AT,
  SORTABLE_COLUMNS.LAST_MESSAGE,
  SORTABLE_COLUMNS.COMMENT,
  SORTABLE_COLUMNS.COMPLETED_BY,
  SORTABLE_COLUMNS.COMPLETED_BY_SECTION,
];

export const MessagesSectionCompleted = connect(
  {
    formattedMessages: state.formattedMessages,
    screenMetadata: state.screenMetadata,
  },
  function MessagesSectionCompleted({ formattedMessages, screenMetadata }) {
    const filters = [
      {
        isSelected: screenMetadata.completedBy,
        key: 'completedBy',
        label: 'Completed By',
        options: formattedMessages.completedByUsers,
        useInlineSelect: false,
      },
    ];
    return (
      <MessageTable
        id="messages-section-completed"
        messageColumns={columns}
        messageFilters={filters}
        selectable={false}
      />
    );
  },
);

MessagesSectionCompleted.displayName = 'MessagesSectionCompleted';
