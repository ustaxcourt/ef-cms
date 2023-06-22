import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import React from 'react';

export function ThirtyDayNoticeModal() {
  return (
    <ConfirmModal
      cancelLabel="Dismiss Reminder"
      confirmLabel="Yes, Serve"
      title="Serve 30 Day Notice?"
      onCancelSequence="dismissThirtyDayTrialAlertSequence"
      onConfirmSequence="serveThirtyDayNoticeOfTrialSequence"
    >
      <p>
        The following document will be served on all parties:
        <span className="text-bold">blah blah blah blah blah</span>
      </p>
    </ConfirmModal>
  );
}

ThirtyDayNoticeModal.displayName = 'ThirtyDayNoticeModal';
