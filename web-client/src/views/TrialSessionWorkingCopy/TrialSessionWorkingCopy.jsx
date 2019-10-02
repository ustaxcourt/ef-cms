import { AddEditCaseNoteModal } from './AddEditCaseNoteModal';
import { AddEditSessionNoteModal } from './AddEditSessionNoteModal';
import { Button } from '../../ustc-ui/Button/Button';
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
    batchDownloadTrialSessionSequence:
      sequences.batchDownloadTrialSessionSequence,
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
    showModal: state.showModal,
  },
  ({
    batchDownloadTrialSessionSequence,
    formattedTrialSessionDetails,
    showModal,
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
              <Button
                link
                aria-label="Download batch of documents in a trial session"
                onClick={() =>
                  batchDownloadTrialSessionSequence({
                    trialSessionId: formattedTrialSessionDetails.trialSessionId,
                    zipName: formattedTrialSessionDetails.zipName,
                  })
                }
              >
                <FontAwesomeIcon icon={['fas', 'cloud-download-alt']} />
                Download All Cases
              </Button>
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
