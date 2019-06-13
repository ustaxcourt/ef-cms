import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const TrialSessionInformation = connect(
  { trialSession: state.trialSession },
  ({ trialSession }) => {
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
                          <p>
                            {trialSession.term} {trialSession.termYear}
                          </p>
                        </div>
                        <div className="grid-col-6">
                          <p className="label">Type</p>
                          <p>{trialSession.sessionType}</p>
                        </div>
                      </div>

                      <div className="grid-row grid-gap">
                        <div className="grid-col-6">
                          <p className="label">Date</p>
                          <p>
                            {trialSession.startDate} {trialSession.startTime}
                          </p>
                        </div>
                        <div className="grid-col-6">
                          <p className="label">Max # of Cases</p>
                          <p>{trialSession.maxCases}</p>
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
                          <p>{trialSession.judge}</p>
                        </div>
                        <div className="grid-col-6">
                          <p className="label">Trial Clerk</p>
                          <p>{trialSession.trialClerk}</p>
                        </div>
                      </div>

                      <div className="grid-row grid-gap">
                        <div className="grid-col-6">
                          <p className="label">Court Report</p>
                          <p>{trialSession.courtReporter}</p>
                        </div>
                        <div className="grid-col-6">
                          <p className="label">IRS Calendar Administrator</p>
                          <p>{trialSession.irsCalendarAdministrator}</p>
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
                    <p>{trialSession.courthouseName}</p>
                    <p>
                      <span className="address-line">
                        {trialSession.address1}
                      </span>
                      <span className="address-line">
                        {trialSession.address2}
                      </span>
                      <span className="address-line">
                        {trialSession.city}, {trialSession.state}{' '}
                        {trialSession.postalCode}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid-col-6">
                <div className="card height-full">
                  <div className="content-wrapper">
                    <h3 className="underlined">Notes</h3>
                    {trialSession.notes}
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
