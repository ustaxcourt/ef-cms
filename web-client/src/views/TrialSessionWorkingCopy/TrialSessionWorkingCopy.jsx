import { AddEditSessionNoteModal } from './AddEditSessionNoteModal';
import { AddEditUserCaseNoteModal } from './AddEditUserCaseNoteModal';
import { Button } from '../../ustc-ui/Button/Button';
import { DeleteSessionNoteConfirmModal } from './DeleteSessionNoteConfirmModal';
import { DeleteUserCaseNoteConfirmModal } from './DeleteUserCaseNoteConfirmModal';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SessionNotes } from './SessionNotes';
import { SuccessNotification } from '../SuccessNotification';
import { TrialSessionDetailHeader } from '../TrialSessionDetail/TrialSessionDetailHeader';
import { WorkingCopySessionList } from './WorkingCopySessionList';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const TrialSessionWorkingCopy = connect(
  {
    batchDownloadTrialSessionSequence:
      sequences.batchDownloadTrialSessionSequence,
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
    showModal: state.modal.showModal,
    trialSessionHeaderHelper: state.trialSessionHeaderHelper,
  },
  function TrialSessionWorkingCopy({
    batchDownloadTrialSessionSequence,
    formattedTrialSessionDetails,
    showModal,
    trialSessionHeaderHelper,
  }) {
    return (
      <>
        <TrialSessionDetailHeader />
        <section className="usa-section grid-container">
          <div className="grid-row">
            <div className="grid-col-9">
              <h2 className="heading-1">
                {trialSessionHeaderHelper.nameToDisplay} - Session Copy
                {trialSessionHeaderHelper.showSwitchToSessionDetail && (
                  <a
                    className="button-switch-box margin-left-2"
                    href={`/trial-session-detail/${formattedTrialSessionDetails.trialSessionId}`}
                  >
                    View All Session Info
                  </a>
                )}
              </h2>
            </div>

            {trialSessionHeaderHelper.showBatchDownloadButton && (
              <div className="grid-col-3 text-right padding-top-2">
                <Button
                  link
                  aria-label="Download batch of documents in a trial session"
                  onClick={() =>
                    batchDownloadTrialSessionSequence({
                      allowRetry: true,
                      trialSessionId:
                        formattedTrialSessionDetails.trialSessionId,
                    })
                  }
                >
                  <FontAwesomeIcon icon={['fas', 'cloud-download-alt']} />
                  Download All Cases
                </Button>
              </div>
            )}
          </div>
          <SuccessNotification />
          <ErrorNotification />
          <SessionNotes />
          <WorkingCopySessionList />
          {showModal === 'DeleteUserCaseNoteConfirmModal' && (
            <DeleteUserCaseNoteConfirmModal onConfirmSequence="deleteUserCaseNoteFromWorkingCopySequence" />
          )}
          {showModal === 'DeleteSessionNoteConfirmModal' && (
            <DeleteSessionNoteConfirmModal />
          )}
          {showModal === 'AddEditUserCaseNoteModal' && (
            <AddEditUserCaseNoteModal onConfirmSequence="updateUserCaseNoteOnWorkingCopySequence" />
          )}
          {showModal === 'AddEditSessionNoteModal' && (
            <AddEditSessionNoteModal />
          )}
        </section>
      </>
    );
  },
);
