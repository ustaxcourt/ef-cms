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
import classNames from 'classnames';

export const TrialSessionWorkingCopy = connect(
  {
    batchDownloadTrialSessionSequence:
      sequences.batchDownloadTrialSessionSequence,
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
    openPrintableTrialSessionWorkingCopyModalSequence:
      sequences.openPrintableTrialSessionWorkingCopyModalSequence,
    showModal: state.modal.showModal,
    trialSessionHeaderHelper: state.trialSessionHeaderHelper,
    trialSessionWorkingCopyHelper: state.trialSessionWorkingCopyHelper,
  },
  function TrialSessionWorkingCopy({
    batchDownloadTrialSessionSequence,
    formattedTrialSessionDetails,
    openPrintableTrialSessionWorkingCopyModalSequence,
    showModal,
    trialSessionHeaderHelper,
    trialSessionWorkingCopyHelper,
  }) {
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

          <div className="grid-row">
            <div className="grid-col-6">
              <div className="grid-col-6">
                <div className="card trial-session-card">
                  <div className="content-wrapper">
                    <h3 className="underlined">Assignments</h3>
                    <div className="grid-container padding-x-0">
                      <div className="grid-row grid-gap">
                        <div className="grid-col-6">
                          <p className="label">Judge</p>
                          <p className="margin-bottom-0">
                            {formattedTrialSessionDetails.formattedJudge}
                          </p>
                          <p>
                            {formattedTrialSessionDetails.chambersPhoneNumber
                              ? formattedTrialSessionDetails.chambersPhoneNumber
                              : 'No phone number'}
                          </p>
                        </div>
                        <div className="grid-col-6">
                          <p className="label">Trial clerk</p>
                          <p>
                            {formattedTrialSessionDetails.formattedTrialClerk}
                          </p>
                        </div>
                      </div>

                      <div
                        className={classNames(
                          'grid-row grid-gap',
                          formattedTrialSessionDetails.showSwingSession &&
                            'margin-bottom-8',
                        )}
                      >
                        <div className="grid-col-6">
                          <p className="label">Court reporter</p>
                          <p className="margin-bottom-0">
                            {
                              formattedTrialSessionDetails.formattedCourtReporter
                            }
                          </p>
                        </div>
                        <div className="grid-col-6">
                          <p className="label">IRS calendar administrator</p>
                          <p className="margin-bottom-0">
                            {
                              formattedTrialSessionDetails.formattedIrsCalendarAdministrator
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid-col-6">
              <SessionNotes />
            </div>
          </div>

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
