import { PrimaryHeader } from '../components/PrimaryHeader';
import { ReportsHeader } from '../components/ReportsHeader';
import { isMemberCase } from '@shared/business/utilities/generateSelectedFilterList';
import React from 'react';
import classNames from 'classnames';

export const TrialCalendar = ({ cases = [], sessionDetail }) => {
  console.log('cases', cases);
  return (
    <div id="trial-calendar">
      <PrimaryHeader />
      <ReportsHeader
        subtitle={`${sessionDetail.startDate} ${sessionDetail.sessionType}`}
        title={sessionDetail.trialLocation}
      />

      <div className="column">
        <div className="card width-half">
          <div className="card-header">Trial Information</div>
          <div className="card-content">
            <div className="width-half" id="start-time">
              <strong>Start Time</strong>
              <br />
              {sessionDetail.startTime}
            </div>
            <div className="width-half" id="location">
              <strong>Location</strong>
              {sessionDetail.noLocationEntered && (
                <div>No location entered</div>
              )}
              {!sessionDetail.noLocationEntered && (
                <>
                  {sessionDetail.courthouseName && (
                    <div>{sessionDetail.courthouseName}</div>
                  )}
                  {sessionDetail.address1 && (
                    <div>{sessionDetail.address1}</div>
                  )}
                  {sessionDetail.address2 && (
                    <div>{sessionDetail.address2}</div>
                  )}
                  {sessionDetail.formattedCityStateZip && (
                    <div>{sessionDetail.formattedCityStateZip}</div>
                  )}
                </>
              )}
            </div>
            <div className="clear"></div>
          </div>
        </div>

        <div className="card width-half">
          <div className="card-header">Assignments</div>
          <div className="card-content">
            <div className="width-half">
              <strong>Judge</strong>
              <div>{sessionDetail.judge}</div>
            </div>
            <div className="width-half">
              <strong>Trial Clerk</strong>
              <div>{sessionDetail.trialClerk}</div>
            </div>
            <div className="clear"></div>
          </div>
          <div className="card-content">
            <div className="width-half wrap-text-content">
              <strong>Court Reporter</strong>
              <div>{sessionDetail.courtReporter}</div>
            </div>
            <div className="width-half wrap-text-content">
              <strong>IRS Calendar Admin</strong>
              <div>{sessionDetail.irsCalendarAdministrator}</div>
            </div>
            <div className="clear"></div>
          </div>
        </div>
      </div>

      <div className="clear"></div>

      <div className="card margin-top-0" id="notes">
        <div className="card-header">Session Notes</div>
        <div className="card-content">{sessionDetail.notes || 'n/a'} </div>
      </div>

      <h4 className="text-center" id="cases-count">
        Open Cases ({cases.length})
      </h4>

      <table>
        <thead>
          <tr>
            <th>Docket No.</th>
            <th>Case Title</th>
            <th>Petitioner Counsel</th>
            <th>Respondent Counsel</th>
            <th>Calendar Notes</th>
          </tr>
        </thead>
        <tbody>
          {cases.map(caseDetail => {
            const memberCase = isMemberCase(caseDetail);

            return (
              <tr key={caseDetail.docketNumberWithSuffix}>
                <td
                  className={`${
                    memberCase ? 'margin-left-2' : ''
                  } docket-number-with-icon`}
                >
                  <div
                    className={classNames(
                      `${caseDetail.isLeadCase && 'lead-consolidated-icon'} ${
                        memberCase && 'consolidated-icon'
                      }`,
                    )}
                    style={{ marginRight: '0.3rem' }}
                  ></div>
                  {caseDetail.docketNumberWithSuffix}
                </td>
                <td>{caseDetail.caseTitle}</td>
                <td>
                  {caseDetail.petitionerCounsel &&
                    caseDetail.petitionerCounsel.map(counsel => (
                      <div
                        key={`counsel-${caseDetail.docketNumberWithSuffix}-${counsel}`}
                      >
                        {counsel}
                      </div>
                    ))}
                </td>
                <td>
                  {caseDetail.respondentCounsel &&
                    caseDetail.respondentCounsel.map(counsel => (
                      <div
                        key={`rcounsel-${caseDetail.docketNumberWithSuffix}-${counsel}`}
                      >
                        {counsel}
                      </div>
                    ))}
                </td>
                <td>{caseDetail.calendarNotes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
