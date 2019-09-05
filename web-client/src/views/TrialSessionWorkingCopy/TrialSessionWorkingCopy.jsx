import { AddEditCaseNoteModal } from './AddEditCaseNoteModal';
import { AddEditSessionNoteModal } from './AddEditSessionNoteModal';
import { DeleteCaseNoteConfirmModal } from './DeleteCaseNoteConfirmModal';
import { DeleteSessionNoteConfirmModal } from './DeleteSessionNoteConfirmModal';
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
    baseUrl: state.baseUrl,
    downloadBatchOfTrialSessionSequence:
      sequences.downloadBatchOfTrialSessionSequence,
    formattedTrialSession: state.formattedTrialSessionDetails,
    showModal: state.showModal,
    token: state.token,
  },
  ({
    baseUrl,
    downloadBatchOfTrialSessionSequence,
    formattedTrialSession,
    showModal,
    token,
  }) => {
    return (
      <>
        <TrialSessionDetailHeader />
        <section className="usa-section grid-container">
          <div className="grid-row">
            <div className="grid-col-9">
              <h2 className="heading-1">Session Working Copy</h2>
            </div>
            <div className="grid-col-3 text-right padding-top-2">
              <a
                aria-label="View PDF"
                href={`${baseUrl}/trial-session/${formattedTrialSession.trialSessionId}/batch-download?token=${token}`}
              >
                <FontAwesomeIcon icon={['fas', 'cloud-download-alt']} />{' '}
                Download All Cases
              </a>
            </div>
          </div>

          <SuccessNotification />
          <ErrorNotification />
          <SessionNotes />
          <WorkingCopySessionList />
          {showModal === 'DeleteCaseNoteConfirmModal' && (
            <DeleteCaseNoteConfirmModal onConfirmSequence="deleteCaseNoteFromWorkingCopySequence" />
          )}
          {showModal === 'DeleteSessionNoteConfirmModal' && (
            <DeleteSessionNoteConfirmModal />
          )}
          {showModal === 'AddEditCaseNoteModal' && (
            <AddEditCaseNoteModal onConfirmSequence="updateCaseNoteOnWorkingCopySequence" />
          )}
          {showModal === 'AddEditSessionNoteModal' && (
            <AddEditSessionNoteModal />
          )}
        </section>
      </>
    );
  },
);
