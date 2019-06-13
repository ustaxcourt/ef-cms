import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const TrialSessionInformation = connect(
  { formattedTrialSession: state.formattedTrialSessionDetails },
  ({ formattedTrialSession }) => {
    return (
      <>
        <h1>Session Information</h1>
        <div className="trial-session-details margin-bottom-6">
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap margin-bottom-4">
              <div className="grid-col-6">
                <div className="card height-full">
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
                          <p>
                            {formattedTrialSession.formattedStartDate}{' '}
                            {formattedTrialSession.formattedStartTime}
                          </p>
                        </div>
                        <div className="grid-col-6">
                          <p className="label">Max # of Cases</p>
                          <p>{formattedTrialSession.maxCases}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid-col-6">
                <div className="card height-full">
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

                      <div className="grid-row grid-gap">
                        <div className="grid-col-6">
                          <p className="label">Court Report</p>
                          <p>{formattedTrialSession.formattedCourtReporter}</p>
                        </div>
                        <div className="grid-col-6">
                          <p className="label">IRS Calendar Administrator</p>
                          <p>
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
                <div className="card height-full">
                  <div className="content-wrapper">
                    <h3 className="underlined">Location</h3>
                    <p className="label">Location</p>
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
                <div className="card height-full">
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
