import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const SessionAssignments = connect(
  {
    formattedTrialSessionDetails: state.formattedTrialSessionDetails!,
  },
  function SessionAssignments({ formattedTrialSessionDetails }) {
    return (
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
                <p data-testid="assignments-sessions-chambers-phone-number">
                  {formattedTrialSessionDetails.formattedChambersPhoneNumber}
                </p>
              </div>
              <div className="grid-col-6">
                <p className="label">Trial clerk</p>
                <p>{formattedTrialSessionDetails.formattedTrialClerk}</p>
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
                <p className="margin-bottom-0 word-wrap-break-word">
                  {formattedTrialSessionDetails.formattedCourtReporter}
                </p>
              </div>
              <div className="grid-col-6">
                <p className="label">IRS calendar administrator</p>
                {!formattedTrialSessionDetails.formattedIrsCalendarAdministratorInfo && (
                  <p
                    className="margin-bottom-0 word-wrap-break-word"
                    data-testid="irs-calendar-admin-info"
                  >
                    {
                      formattedTrialSessionDetails.formattedIrsCalendarAdministrator
                    }
                  </p>
                )}

                {formattedTrialSessionDetails.formattedIrsCalendarAdministratorInfo && (
                  <div
                    className="margin-bottom-0 word-wrap-break-word"
                    data-testid="irs-calendar-admin-info"
                  >
                    <div data-testid="irs-calendar-admin-info-name">
                      {
                        formattedTrialSessionDetails
                          .formattedIrsCalendarAdministratorInfo.name
                      }
                    </div>
                    <div
                      data-testid="irs-calendar-admin-info-email"
                      style={{
                        overflowWrap: 'break-word',
                        wordBreak: 'break-all',
                      }}
                    >
                      {
                        formattedTrialSessionDetails
                          .formattedIrsCalendarAdministratorInfo.email
                      }
                    </div>
                    <div data-testid="irs-calendar-admin-info-phone">
                      {
                        formattedTrialSessionDetails
                          .formattedIrsCalendarAdministratorInfo.phone
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
