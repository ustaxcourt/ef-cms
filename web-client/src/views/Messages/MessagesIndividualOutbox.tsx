import {
  MessageColumnData,
  MessageList,
} from '@web-client/views/Messages/MessageList';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const columns: MessageColumnData[] = [
  {
    columnName: 'Docket No.',
    dataTestId: 'message-individual-docket-number-header-button',
    iconClassName: 'consolidated-case-column',
    sortField: 'docketNumber',
  },
  {
    columnName: 'Sent',
    dataTestId: 'message-individual-received-header-button',
    sortField: 'createdAt',
  },
  {
    columnName: 'Message',
    dataTestId: 'message-individual-subject-header-button',
    iconClassName: 'message-unread-column',
    sortField: 'subject',
  },
  {
    columnName: 'Case Title',
    dataTestId: 'message-individual-case-title-header-button',
    sortField: 'caseTitle',
  },
  {
    columnName: 'Case Status',
    dataTestId: 'message-individual-case-status-header-button',
    sortField: 'caseStatus',
  },
  {
    columnName: 'To',
    dataTestId: 'message-individual-from-header-button',
    sortField: 'to',
  },
  {
    columnName: 'Section',
    dataTestId: 'message-individual-section-header-button',
    sortField: 'toSection',
  },
];

export const MessagesIndividualOutbox = connect(
  {
    constants: state.constants,
    formattedMessages: state.formattedMessages,
    screenMetadata: state.screenMetadata,
    sortTableSequence: sequences.sortTableSequence,
    tableSort: state.tableSort,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
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
