import {
  MessageColumnData,
  SORTABLE_COLUMNS,
} from '@web-client/views/Messages/MessageColumns';
import { MessageTable } from '@web-client/views/Messages/MessageTable';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

const columns: MessageColumnData[] = [
  SORTABLE_COLUMNS.DOCKET_NUMBER,
  SORTABLE_COLUMNS.COMPLETED_AT,
  SORTABLE_COLUMNS.LAST_MESSAGE,
  SORTABLE_COLUMNS.COMMENT,
  SORTABLE_COLUMNS.CASE_TITLE,
];

export const MessagesIndividualCompleted = connect(
  {},
  function MessagesIndividualCompleted() {
    return (
      <MessageTable
        id="messages-individual-completed"
        messageColumns={columns}
        messageFilters={[]}
        selectable={false}
      />
    );
  },
);

MessagesIndividualCompleted.displayName = 'MessagesIndividualCompleted';
