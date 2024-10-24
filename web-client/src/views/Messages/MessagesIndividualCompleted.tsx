import {
  COLUMN_NAMES,
  MessageColumnData,
  getColumnData,
} from '@web-client/views/Messages/MessageColumns';
import { MessageList } from '@web-client/views/Messages/MessageList';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

const columns: MessageColumnData[] = getColumnData([
  COLUMN_NAMES.DOCKET_NUMBER,
  COLUMN_NAMES.COMPLETED,
  COLUMN_NAMES.LAST_MESSAGE,
  COLUMN_NAMES.COMMENT,
  COLUMN_NAMES.CASE_TITLE,
]);

export const MessagesIndividualCompleted = connect(
  {},
  function MessagesIndividualCompleted() {
    return (
      <MessageList
        messageColumns={columns}
        messageFilters={[]}
        selectable={false}
      />
    );
  },
);

MessagesIndividualCompleted.displayName = 'MessagesIndividualCompleted';
