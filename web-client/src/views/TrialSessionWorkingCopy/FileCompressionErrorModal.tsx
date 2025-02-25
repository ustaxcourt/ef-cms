import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const FileCompressionErrorModal = connect(
  {
    allowRetry: state.batchDownloads.allowRetry,
    batchDownloadTrialSessionSequence:
      sequences.batchDownloadTrialSessionSequence,
    clearModalSequence: sequences.clearModalSequence,
    trialSession: state.trialSession,
  },
  function FileCompressionErrorModal({
    allowRetry,
    batchDownloadTrialSessionSequence,
    clearModalSequence,
    trialSession,
  }) {
    const trialSessionTitle = trialSession.trialLocation;

    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Try Again"
        hasErrorState={true}
        headerIcon="info-circle"
        headerIconClassName="text-secondary-dark"
        noCancel={!allowRetry}
        noConfirm={!allowRetry}
        title="Unable to Compress Files"
        onCancelSequence={clearModalSequence}
        onConfirmSequence={batchDownloadTrialSessionSequence}
      >
        {(allowRetry && (
          <>
            <p>
              An error occurred during the file compression of “
              {trialSessionTitle}” trial session. Do you want to try again?
            </p>
            <p> If you cancel, it will stop the entire download process.</p>
          </>
        )) || (
          <p>
            Please try again. If this error persists, contact{' '}
            <a href={`mailto:${TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}`}>
              {TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}
            </a>
            .
          </p>
        )}
      </ConfirmModal>
    );
  },
);

FileCompressionErrorModal.displayName = 'FileCompressionErrorModal';
