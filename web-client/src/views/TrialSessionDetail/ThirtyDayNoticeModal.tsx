import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ThirtyDayNoticeModal = connect(
  {
    thirtyDayNoticeModalHelper: state.thirtyDayNoticeModalHelper,
  },
  function ThirtyDayNoticeModal({ thirtyDayNoticeModalHelper }) {
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
          <span className="display-block text-bold margin-top-205">
            30 Day Notice of Trial on{' '}
            {thirtyDayNoticeModalHelper.formattedStartDate} at{' '}
            {thirtyDayNoticeModalHelper.trialLocation}
          </span>
        </p>
      </ConfirmModal>
    );
  },
);

ThirtyDayNoticeModal.displayName = 'ThirtyDayNoticeModal';
