import { AddEditSessionNoteModal } from './AddEditSessionNoteModal';
import { AddEditUserCaseNoteModal } from './AddEditUserCaseNoteModal';
import { Button } from '../../ustc-ui/Button/Button';
import { ConfirmModal } from '@web-client/ustc-ui/Modal/ConfirmModal';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SessionAssignments } from './SessionAssignments';
import { SessionNotes } from './SessionNotes';
import { SuccessNotification } from '../SuccessNotification';
import { TrialSessionDetailHeader } from '../TrialSessionDetail/TrialSessionDetailHeader';
import { WorkingCopySessionList } from './WorkingCopySessionList';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const TrialSessionWorkingCopy = connect(
  {
    batchDownloadTrialSessionSequence:
      sequences.batchDownloadTrialSessionSequence,
    clearModalSequence: sequences.clearModalSequence,
    deleteUserCaseNoteFromWorkingCopySequence:
      sequences.deleteUserCaseNoteFromWorkingCopySequence,
    deleteWorkingCopySessionNoteSequence:
      sequences.deleteWorkingCopySessionNoteSequence,
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
    openPrintableTrialSessionWorkingCopyModalSequence:
      sequences.openPrintableTrialSessionWorkingCopyModalSequence,
    showModal: state.modal.showModal,
    trialSessionHeaderHelper: state.trialSessionHeaderHelper,
    trialSessionWorkingCopyHelper: state.trialSessionWorkingCopyHelper,
    updateUserCaseNoteOnWorkingCopySequence:
      sequences.updateUserCaseNoteOnWorkingCopySequence,
  },
  function TrialSessionWorkingCopy({
    batchDownloadTrialSessionSequence,
    clearModalSequence,
    deleteUserCaseNoteFromWorkingCopySequence,
    deleteWorkingCopySessionNoteSequence,
    formattedTrialSessionDetails,
    openPrintableTrialSessionWorkingCopyModalSequence,
    showModal,
    trialSessionHeaderHelper,
    trialSessionWorkingCopyHelper,
    updateUserCaseNoteOnWorkingCopySequence,
  }) {
    console.log('Inside of trial session working copy');
    console.log(
      'Formatted Trial Session Details: ',
      formattedTrialSessionDetails,
    );
    return (
      <>
        <TrialSessionDetailHeader />
        <section className="usa-section grid-container">
          <div className="grid-row">
            <div className="grid-col-8">
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
            {trialSessionWorkingCopyHelper.showPrintButton ? (
              <div className="grid-col-2 text-right padding-top-1">
                <Button
                  link
                  aria-label="Print session copy"
                  icon="print"
                  id="print-session-working-copy"
                  onClick={() =>
                    openPrintableTrialSessionWorkingCopyModalSequence()
                  }
                >
                  Print
                </Button>
              </div>
            ) : (
              <div className="grid-col-2 text-right padding-top-1" />
            )}
            {trialSessionHeaderHelper.showBatchDownloadButton && (
              <div className="grid-col-2 text-right padding-top-1">
                <Button
                  link
                  aria-label="Download batch of documents in a trial session"
                  data-testid="download-all-trial-session-cases-button"
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

          <div className="grid-row  grid-gap">
            <div className="grid-col-6">
              <SessionAssignments />
            </div>
            <div className="grid-col-6">
              <SessionNotes />
            </div>
          </div>

          <WorkingCopySessionList />
          {showModal === 'DeleteUserCaseNoteConfirmModal' && (
            <ConfirmModal
              noCloseBtn
              cancelLabel="No, Cancel"
              confirmLabel="Yes, Delete"
              title="Are You Sure You Want to Delete This Note?"
              onCancelSequence={clearModalSequence}
              onConfirmSequence={deleteUserCaseNoteFromWorkingCopySequence}
            >
              <p>This action cannot be undone.</p>
            </ConfirmModal>
          )}
          {showModal === 'DeleteSessionNoteConfirmModal' && (
            <ConfirmModal
              noCloseBtn
              cancelLabel="No, Cancel"
              confirmLabel="Yes, Delete"
              title="Are You Sure You Want to Delete This Note?"
              onCancelSequence={clearModalSequence}
              onConfirmSequence={deleteWorkingCopySessionNoteSequence}
            >
              <p>This action cannot be undone.</p>
            </ConfirmModal>
          )}
          {showModal === 'AddEditUserCaseNoteModal' && (
            <AddEditUserCaseNoteModal
              onConfirmSequence={updateUserCaseNoteOnWorkingCopySequence}
            />
          )}
          {showModal === 'AddEditSessionNoteModal' && (
            <AddEditSessionNoteModal />
          )}
        </section>
      </>
    );
  },
);

TrialSessionWorkingCopy.displayName = 'TrialSessionWorkingCopy';
