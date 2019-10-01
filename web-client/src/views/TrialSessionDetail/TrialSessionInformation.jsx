import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const TrialSessionInformation = connect(
  {
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
    printTrialCalendarSequence: sequences.printTrialCalendarSequence,
  },
  ({ formattedTrialSessionDetails, printTrialCalendarSequence }) => {
    return (
      <>
        <div className="grid-container padding-x-0">
          <div className="grid-row">
            <div className="grid-col-10">
              <h1>Session Information</h1>
            </div>
            <div className="grid-col-2">
              {formattedTrialSessionDetails.isCalendared && (
                <Button
                  link
                  className="float-right margin-right-0"
                  onClick={() => {
                    printTrialCalendarSequence();
                  }}
                >
                  <FontAwesomeIcon
                    className="margin-right-05"
                    icon="print"
                    size="1x"
                  />
                  Printable Trial Calendar
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="trial-session-details margin-bottom-4">
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap margin-bottom-2">
              <div className="grid-col-6">
                <div className="card">
                  <div className="content-wrapper">
                    <h3 className="underlined">Details</h3>
                    <div className="grid-container padding-x-0">
                      <div className="grid-row grid-gap">
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
                            className={
                              formattedTrialSessionDetails.showSwingSession
                                ? ''
                                : 'margin-bottom-0'
                            }
                          >
                            {formattedTrialSessionDetails.formattedStartDate}{' '}
                            {formattedTrialSessionDetails.formattedStartTime}
                          </p>
                        </div>
                        <div className="grid-col-6">
                          <p className="label">Max # of Cases</p>
                          <p
                            className={
                              formattedTrialSessionDetails.showSwingSession
                                ? ''
                                : 'margin-bottom-0'
                            }
                          >
                            {formattedTrialSessionDetails.maxCases}
                          </p>
                        </div>
                      </div>

                      {formattedTrialSessionDetails.showSwingSession && (
                        <div className="grid-row grid-gap">
                          <div className="grid-col-6">
                            <p className="label">Swing Session</p>
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
                <div className="card">
                  <div className="content-wrapper">
                    <h3 className="underlined">Assignments</h3>
                    <div className="grid-container padding-x-0">
                      <div className="grid-row grid-gap">
                        <div className="grid-col-6">
                          <p className="label">Judge</p>
                          <p>{formattedTrialSessionDetails.formattedJudge}</p>
                        </div>
                        <div className="grid-col-6">
                          <p className="label">Trial Clerk</p>
                          <p>
                            {formattedTrialSessionDetails.formattedTrialClerk}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`grid-row grid-gap ${
                          formattedTrialSessionDetails.showSwingSession
                            ? 'margin-bottom-8'
                            : ''
                        }`}
                      >
                        <div className="grid-col-6">
                          <p className="label">Court Reporter</p>
                          <p className="margin-bottom-0">
                            {
                              formattedTrialSessionDetails.formattedCourtReporter
                            }
                          </p>
                        </div>
                        <div className="grid-col-6">
                          <p className="label">IRS Calendar Administrator</p>
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
                <div className="card trial-session-card">
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
              </div>
              <div className="grid-col-6">
                <div className="card trial-session-card">
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
