import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const TrialSessionInformation = connect(
  {
    formattedTrialSession: state.formattedTrialSessionDetails,
    printTrialCalendarSequence: sequences.printTrialCalendarSequence,
  },
  ({ formattedTrialSession, printTrialCalendarSequence }) => {
    return (
      <>
        <div className="grid-container padding-x-0">
          <div className="grid-row">
            <div className="grid-col-10">
              <h1>Session Information</h1>
            </div>
            <div className="grid-col-2">
              {formattedTrialSession.isCalendared && (
                <button
                  className="usa-button usa-button--unstyled float-right margin-top-2"
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
                </button>
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
                          <p>{formattedTrialSession.formattedTerm}</p>
                        </div>
                        <div className="grid-col-6">
                          <p className="label">Type</p>
                          <p>{formattedTrialSession.sessionType}</p>
                        </div>
                      </div>

                      <div className="grid-row grid-gap">
                        <div className="grid-col-6">
                          <p className="label">Date</p>
                          <p
                            className={
                              formattedTrialSession.showSwingSession
                                ? ''
                                : 'margin-bottom-0'
                            }
                          >
                            {formattedTrialSession.formattedStartDate}{' '}
                            {formattedTrialSession.formattedStartTime}
                          </p>
                        </div>
                        <div className="grid-col-6">
                          <p className="label">Max # of Cases</p>
                          <p
                            className={
                              formattedTrialSession.showSwingSession
                                ? ''
                                : 'margin-bottom-0'
                            }
                          >
                            {formattedTrialSession.maxCases}
                          </p>
                        </div>
                      </div>

                      {formattedTrialSession.showSwingSession && (
                        <div className="grid-row grid-gap">
                          <div className="grid-col-6">
                            <p className="label">Swing Session</p>
                            <p className="margin-bottom-0">
                              <a
                                href={`/trial-session-detail/${formattedTrialSession.swingSessionId}`}
                              >
                                {formattedTrialSession.swingSessionLocation}
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
                          <p>{formattedTrialSession.formattedJudge}</p>
                        </div>
                        <div className="grid-col-6">
                          <p className="label">Trial Clerk</p>
                          <p>{formattedTrialSession.formattedTrialClerk}</p>
                        </div>
                      </div>

                      <div
                        className={`grid-row grid-gap ${
                          formattedTrialSession.showSwingSession
                            ? 'margin-bottom-8'
                            : ''
                        }`}
                      >
                        <div className="grid-col-6">
                          <p className="label">Court Reporter</p>
                          <p className="margin-bottom-0">
                            {formattedTrialSession.formattedCourtReporter}
                          </p>
                        </div>
                        <div className="grid-col-6">
                          <p className="label">IRS Calendar Administrator</p>
                          <p className="margin-bottom-0">
                            {
                              formattedTrialSession.formattedIrsCalendarAdministrator
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
                    {formattedTrialSession.noLocationEntered && (
                      <p>No location entered</p>
                    )}
                    <p>{formattedTrialSession.courthouseName}</p>
                    <p>
                      <span className="address-line">
                        {formattedTrialSession.address1}
                      </span>
                      <span className="address-line">
                        {formattedTrialSession.address2}
                      </span>
                      <span className="address-line">
                        {formattedTrialSession.formattedCityStateZip}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid-col-6">
                <div className="card trial-session-card">
                  <div className="content-wrapper">
                    <h3 className="underlined">Notes</h3>
                    {formattedTrialSession.notes}
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
