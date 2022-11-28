import { Button } from '../../ustc-ui/Button/Button';
import { DeleteTrialSessionModal } from './DeleteTrialSessionModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const RemoteProceedingInformation = ({ formattedTrialSessionDetails }) => {
  return (
    <div className="card trial-session-card height-full">
      <div className="content-wrapper">
        <h3 className="underlined">Remote Proceeding</h3>
        <div className="grid-row grid-gap">
          <div className="grid-col-6">
            <p className="label">Meeting ID</p>
            <p>{formattedTrialSessionDetails.meetingId || 'Not provided'}</p>
          </div>
          <div className="grid-col-6">
            <p className="label">Join by telephone</p>
            <p>
              {formattedTrialSessionDetails.joinPhoneNumber || 'Not provided'}
            </p>
          </div>
        </div>
        <div className="grid-row grid-gap">
          <div className="grid-col-6">
            <p className="label">Password</p>
            <p>{formattedTrialSessionDetails.password || 'Not provided'}</p>
          </div>
          <div className="grid-col-6">
            <p className="label">Chambers phone number</p>
            <p>
              {formattedTrialSessionDetails.chambersPhoneNumber ||
                'Not provided'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InPersonProceedingInformation = ({ formattedTrialSessionDetails }) => {
  return (
    <div className="card trial-session-card height-full">
      <div className="content-wrapper">
        <h3 className="underlined">Courthouse Location</h3>
        {formattedTrialSessionDetails.noLocationEntered && (
          <p>No location entered</p>
        )}
        <p>{formattedTrialSessionDetails.courthouseName}</p>
        <p>
          <span className="address-line">
            {formattedTrialSessionDetails.address1}
          </span>
          <span className="address-line">
            {formattedTrialSessionDetails.address2}
          </span>
          <span className="address-line">
            {formattedTrialSessionDetails.formattedCityStateZip}
          </span>
        </p>
      </div>
    </div>
  );
};

export const TrialSessionInformation = connect(
  {
    TRIAL_SESSION_PROCEEDING_TYPES:
      state.constants.TRIAL_SESSION_PROCEEDING_TYPES,
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
    openConfirmDeleteTrialSessionModalSequence:
      sequences.openConfirmDeleteTrialSessionModalSequence,
    printTrialCalendarSequence: sequences.printTrialCalendarSequence,
    showModal: state.modal.showModal,
    trialSessionHeaderHelper: state.trialSessionHeaderHelper,
  },
  function TrialSessionInformation({
    formattedTrialSessionDetails,
    openConfirmDeleteTrialSessionModalSequence,
    printTrialCalendarSequence,
    showModal,
    TRIAL_SESSION_PROCEEDING_TYPES,
    trialSessionHeaderHelper,
  }) {
    return (
      <>
        <div className="grid-container padding-x-0">
          <div className="grid-row">
            <div className="grid-col-9">
              <h1>
                Session Information
                {trialSessionHeaderHelper.showSwitchToWorkingCopy && (
                  <a
                    className="button-switch-box margin-left-2"
                    href={`/trial-session-working-copy/${formattedTrialSessionDetails.trialSessionId}`}
                  >
                    View Session Copy
                  </a>
                )}
                {formattedTrialSessionDetails.canEdit && (
                  <Button
                    link
                    className="margin-left-2 margin-top-2"
                    href={`/edit-trial-session/${formattedTrialSessionDetails.trialSessionId}`}
                    icon="edit"
                  >
                    Edit
                  </Button>
                )}
              </h1>
            </div>
            <div className="grid-col-3 display-flex">
              <span className="flex-push-right width-0 margin-left-auto" />
              {formattedTrialSessionDetails.canDelete && (
                <Button
                  link
                  className="margin-top-2 red-warning"
                  icon="trash"
                  onClick={() => {
                    openConfirmDeleteTrialSessionModalSequence();
                  }}
                >
                  Delete Session
                </Button>
              )}
              {showModal === 'DeleteTrialSessionModal' && (
                <DeleteTrialSessionModal />
              )}
              {formattedTrialSessionDetails.isCalendared && (
                <Button
                  link
                  className="margin-top-2 margin-left-4"
                  icon="print"
                  onClick={() => {
                    printTrialCalendarSequence();
                  }}
                >
                  Print
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="margin-bottom-4">
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap margin-bottom-2">
              <div className="grid-col-6">
                <div className="card trial-session-card">
                  <div className="content-wrapper">
                    <h3 className="underlined">Details</h3>
                    <div className="grid-container padding-x-0 padding-top-1 padding-bottom-1">
                      <div className="grid-row grid-gap padding-bottom-1">
                        <div className="grid-col-6">
                          <p className="label">Term</p>
                          <p>{formattedTrialSessionDetails.formattedTerm}</p>
                        </div>
                        <div className="grid-col-6">
                          <p className="label">Type</p>
                          <p>{formattedTrialSessionDetails.sessionType}</p>
                        </div>
                      </div>

                      <div className="grid-row grid-gap">
                        <div className="grid-col-6">
                          <p className="label">Date</p>
                          <p
                            className={classNames(
                              !formattedTrialSessionDetails.showSwingSession &&
                                'margin-bottom-0',
                            )}
                          >
                            {formattedTrialSessionDetails.formattedStartDate}{' '}
                            {formattedTrialSessionDetails.formattedStartTime}
                            {formattedTrialSessionDetails.formattedEstimatedEndDate &&
                              ` - ${formattedTrialSessionDetails.formattedEstimatedEndDate}`}
                          </p>
                        </div>

                        {!trialSessionHeaderHelper.isStandaloneSession && (
                          <div className="grid-col-6">
                            <p className="label">Max # of cases</p>
                            <p
                              className={classNames(
                                !formattedTrialSessionDetails.showSwingSession &&
                                  'margin-bottom-0',
                              )}
                            >
                              {formattedTrialSessionDetails.maxCases}
                            </p>
                          </div>
                        )}
                      </div>

                      {formattedTrialSessionDetails.showSwingSession && (
                        <div className="grid-row grid-gap">
                          <div className="grid-col-6">
                            <p className="label">Swing session</p>
                            <p className="margin-bottom-0">
                              <a
                                href={`/trial-session-detail/${formattedTrialSessionDetails.swingSessionId}`}
                              >
                                {
                                  formattedTrialSessionDetails.swingSessionLocation
                                }
                              </a>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
            <div className="grid-row grid-gap">
              <div className="grid-col-6">
                {formattedTrialSessionDetails.proceedingType ===
                  TRIAL_SESSION_PROCEEDING_TYPES.inPerson &&
                  InPersonProceedingInformation({
                    formattedTrialSessionDetails,
                  })}

                {formattedTrialSessionDetails.proceedingType ===
                  TRIAL_SESSION_PROCEEDING_TYPES.remote &&
                  RemoteProceedingInformation({ formattedTrialSessionDetails })}
              </div>
              <div className="grid-col-6">
                <div className="card trial-session-card height-full">
                  <div className="content-wrapper">
                    <h3 className="underlined">Notes</h3>
                    {formattedTrialSessionDetails.notes}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);
