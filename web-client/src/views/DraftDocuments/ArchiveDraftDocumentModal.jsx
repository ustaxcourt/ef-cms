import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const ArchiveDraftDocumentModal = connect(
  {
    archiveDraftDocument: state.archiveDraftDocument,
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.archiveDraftDocumentSequence,
  },
  function ArchiveDraftDocumentModal({
    archiveDraftDocument,
    cancelSequence,
    confirmSequence,
    message = 'Once deleted, it can’t be restored.',
    showDocumentTitle = true,
    title = 'Are You Sure You Want to Delete This Document?',
  }) {
    return (
      <ModalDialog
        cancelLabel="No, Take Me Back"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Delete"
        confirmSequence={confirmSequence}
        message={message}
        title={title}
      >
        {showDocumentTitle && (
          <div className="margin-bottom-2 semi-bold">
            {archiveDraftDocument.documentTitle}
          </div>
        )}
      </ModalDialog>
    );
  },
);
