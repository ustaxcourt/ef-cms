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
  ({ archiveDraftDocument, cancelSequence, confirmSequence }) => {
    return (
      <ModalDialog
        cancelLabel="No, take me back"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Yes, delete"
        confirmSequence={confirmSequence}
        message="Once deleted, it can’t be restored."
        title="Are you sure you want to delete this document?"
      >
        <div className="margin-bottom-2 semi-bold">
          {archiveDraftDocument.documentTitle}
        </div>
      </ModalDialog>
    );
  },
);
