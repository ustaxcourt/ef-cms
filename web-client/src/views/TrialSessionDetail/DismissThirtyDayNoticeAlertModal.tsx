import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import React from 'react';

/**
 * DismissThirtyDayNoticeAlertModal
 * @returns {JSX.Element} Returns a modal dialog for dismissing a 30 day NOTT alert
 */
export function DismissThirtyDayNoticeAlertModal() {
  return (
    <ConfirmModal
      cancelLabel="Cancel"
      confirmLabel="Yes"
      title="30-day Notices"
      onCancelSequence="dismissModalSequence"
      onConfirmSequence="dismissThirtyDayTrialAlertSequence"
    >
      <p>
        Have all 30-day notices been sent out for this trial date? <br />
        &quot;Yes&quot; will dismiss the 30-day notice notifications for this
        trial session.
      </p>
    </ConfirmModal>
  );
}

DismissThirtyDayNoticeAlertModal.displayName =
  'DismissThirtyDayNoticeAlertModal';
