import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const DismissThirtyDayNoticeModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
    dismissThirtyDayTrialAlertSequence:
      sequences.dismissThirtyDayTrialAlertSequence,
  },
  function DismissThirtyDayNoticeModal({
    clearModalSequence,
    dismissThirtyDayTrialAlertSequence,
  }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Yes"
        title="30-Day Notices"
        onCancelSequence={clearModalSequence}
        onConfirmSequence={dismissThirtyDayTrialAlertSequence}
      >
        <p>
          Have all 30-day notices been sent out for this trial date?
          &quot;Yes&quot; will dismiss the 30-day notice notifications for this
          trial session.
        </p>
      </ConfirmModal>
    );
  },
);
