import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const FileCompressionErrorModal = connect(
  {
    allowRetry: state.batchDownloads.allowRetry,
    trialSession: state.trialSession,
  },
  function FileCompressionErrorModal({ allowRetry, trialSession }) {
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
        preventCancelOnBlur={true}
        title="File Compression Error"
        onCancelSequence="clearModalSequence"
        onConfirmSequence="batchDownloadTrialSessionSequence"
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
            An error occurred during the file compression of “
            {trialSessionTitle}” trial session. Please contact OIS.
          </p>
        )}
      </ConfirmModal>
    );
  },
);

FileCompressionErrorModal.displayName = 'FileCompressionErrorModal';
