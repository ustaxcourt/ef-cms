import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const EmptyHopperModal = connect({}, function EmptyHopperModal() {
  return (
    <ConfirmModal
      cancelLabel="Cancel"
      confirmLabel="Scan"
      title="The hopper is empty"
      onCancelSequence="clearModalSequence"
      onConfirmSequence="startScanSequence"
    >
      Please load the hopper to scan your batch.
    </ConfirmModal>
  );
});

export const ConfirmRescanBatchModal = connect(
  { batchIndex: state.scanner.batchIndexToRescan },
  function ConfirmRescanBatchModal({ batchIndex }) {
    return (
      <ConfirmModal
        cancelLabel="No, Cancel"
        confirmLabel="Yes, Rescan"
        title={`Rescan Batch ${batchIndex + 1}`}
        onCancelSequence="clearModalSequence"
        onConfirmSequence="rescanBatchSequence"
      >
        Are you sure you want to rescan batch {batchIndex + 1}?
      </ConfirmModal>
    );
  },
);
export const DeleteBatchModal = connect(
  {
    batchIndex: state.scanner.batchIndexToDelete,
    pageCount: state.scanner.batchToDeletePageCount,
  },
  function DeleteBatchModal({ batchIndex, pageCount }) {
    return (
      <ConfirmModal
        cancelLabel="No, Cancel"
        confirmLabel="Yes, Delete"
        title={`Are you sure you want to delete Batch ${batchIndex + 1}?`}
        onCancelSequence="clearModalSequence"
        onConfirmSequence="removeBatchSequence"
      >
        This will delete {pageCount} {pageCount === 1 ? 'page' : 'pages'} from
        your document.
      </ConfirmModal>
    );
  },
);

export const ScanErrorModal = connect({}, function ScanErrorModal() {
  return (
    <ConfirmModal
      noCancel
      confirmLabel="OK"
      title="An error occurred while scanning"
      onCancelSequence="clearModalSequence"
      onConfirmSequence="clearModalSequence"
    >
      Please try again or contact your IT Administrator.
    </ConfirmModal>
  );
});
export const UnfinishedScansModal = connect(
  {},
  function UnfinishedScansModal() {
    return (
      <ConfirmModal
        noCancel
        confirmLabel="OK"
        title="You have unfinished scans"
        onCancelSequence="clearModalSequence"
        onConfirmSequence="clearModalSequence"
      >
        Please ensure your scans are completed and all PDFs have been created
        before continuing.
      </ConfirmModal>
    );
  },
);
