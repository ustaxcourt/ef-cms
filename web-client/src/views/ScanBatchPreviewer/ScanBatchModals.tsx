import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const EmptyHopperModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
    startScanSequence: sequences.startScanSequence,
  },
  function EmptyHopperModal({ clearModalSequence, startScanSequence }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Scan"
        title="The hopper is empty"
        onCancelSequence={clearModalSequence}
        onConfirmSequence={startScanSequence}
      >
        Please load the hopper to scan your batch.
      </ConfirmModal>
    );
  },
);
EmptyHopperModal.displayName = 'EmptyHopperModal';

export const ConfirmRescanBatchModal = connect(
  {
    batchIndex: state.scanner.batchIndexToRescan,
    clearModalSequence: sequences.clearModalSequence,
    rescanBatchSequence: sequences.rescanBatchSequence,
  },
  function ConfirmRescanBatchModal({
    batchIndex,
    clearModalSequence,
    rescanBatchSequence,
  }) {
    return (
      <ConfirmModal
        cancelLabel="No, Cancel"
        confirmLabel="Yes, Rescan"
        title={`Rescan Batch ${batchIndex + 1}`}
        onCancelSequence={clearModalSequence}
        onConfirmSequence={rescanBatchSequence}
      >
        Are you sure you want to rescan batch {batchIndex + 1}?
      </ConfirmModal>
    );
  },
);
ConfirmRescanBatchModal.displayName = 'ConfirmRescanBatchModal';

export const DeleteBatchModal = connect(
  {
    batchIndex: state.scanner.batchIndexToDelete,
    clearModalSequence: sequences.clearModalSequence,
    pageCount: state.scanner.batchToDeletePageCount,
    removeBatchSequence: sequences.removeBatchSequence,
  },
  function DeleteBatchModal({
    batchIndex,
    clearModalSequence,
    pageCount,
    removeBatchSequence,
  }) {
    return (
      <ConfirmModal
        cancelLabel="No, Cancel"
        confirmLabel="Yes, Delete"
        title={`Are you sure you want to delete Batch ${batchIndex + 1}?`}
        onCancelSequence={clearModalSequence}
        onConfirmSequence={removeBatchSequence}
      >
        This will delete {pageCount} {pageCount === 1 ? 'page' : 'pages'} from
        your document.
      </ConfirmModal>
    );
  },
);
DeleteBatchModal.displayName = 'DeleteBatchModal';

export const ScanErrorModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
  },
  function ScanErrorModal({ clearModalSequence }) {
    return (
      <ConfirmModal
        noCancel
        confirmLabel="OK"
        title="An error occurred while scanning"
        onCancelSequence={clearModalSequence}
        onConfirmSequence={clearModalSequence}
      >
        Please try again or contact your IT Administrator.
      </ConfirmModal>
    );
  },
);
ScanErrorModal.displayName = 'ScanErrorModal';

export const UnfinishedScansModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
  },
  function UnfinishedScansModal({ clearModalSequence }) {
    return (
      <ConfirmModal
        noCancel
        confirmLabel="OK"
        title="You have unfinished scans"
        onCancelSequence={clearModalSequence}
        onConfirmSequence={clearModalSequence}
      >
        Please ensure your scans are completed and all PDFs have been created
        before continuing.
      </ConfirmModal>
    );
  },
);
UnfinishedScansModal.displayName = 'UnfinishedScansModal';
