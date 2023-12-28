import { PrimaryHeader } from '../components/PrimaryHeader';
import { RawIrsCalendarAdministratorInfo } from '@shared/business/entities/trialSessions/IrsCalendarAdministratorInfo';
import { ReportsHeader } from '../components/ReportsHeader';
import { isMemberCase } from '@shared/business/utilities/generateSelectedFilterList';
import React from 'react';
import classNames from 'classnames';

export const TrialCalendar = ({
  cases = [],
  sessionDetail,
}: {
  cases: {
    docketNumber: string;
    docketNumberWithSuffix: string;
    caseTitle: string;
    inConsolidatedGroup: boolean;
    respondentCounsel?: string[];
    calendarNotes?: string;
    isLeadCase: boolean;
    petitionerCounsel?: string[];
    shouldIndent?: boolean;
  }[];
  sessionDetail: {
    startTime: string;
    startDate: string;
    sessionType: string;
    courthouseName?: string;
    address1?: string;
    address2?: string;
    formattedCityStateZip: string;
    judge: string;
    trialClerk: string;
    courtReporter: string;
    notes?: string;
    irsCalendarAdministrator: string;
    irsCalendarAdministratorInfo: RawIrsCalendarAdministratorInfo;
    noLocationEntered?: boolean;
    trialLocation?: string;
  };
}) => {
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
              {!sessionDetail.irsCalendarAdministratorInfo && (
                <div>{sessionDetail.irsCalendarAdministrator}</div>
              )}
              {sessionDetail.irsCalendarAdministratorInfo && (
                <>
                  <div>{sessionDetail.irsCalendarAdministratorInfo.name}</div>
                  <div
                    style={{
                      overflowWrap: 'break-word',
                      wordBreak: 'break-all',
                    }}
                  >
                    {sessionDetail.irsCalendarAdministratorInfo.email}
                  </div>
                  <div>{sessionDetail.irsCalendarAdministratorInfo.phone}</div>
                </>
              )}
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
            <th className="no-wrap">Docket No.</th>
            <th>Case Title</th>
            <th>Petitioner Counsel</th>
            <th>Respondent Counsel</th>
          </tr>
        </thead>
        <tbody>
          {cases.map(caseDetail => {
            const memberCase = isMemberCase(caseDetail);

            return (
              <React.Fragment key={caseDetail.docketNumber}>
                <tr className="border-bottom-0">
                  <td
                    className={classNames(
                      {
                        'margin-left-2': caseDetail.shouldIndent,
                      },
                      'docket-number-with-icon',
                      'no-wrap',
                    )}
                  >
                    <div
                      className={classNames(
                        caseDetail.isLeadCase ? 'lead-consolidated-icon' : '',
                        memberCase ? 'consolidated-icon' : '',
                      )}
                    ></div>
                    <div> {caseDetail.docketNumberWithSuffix}</div>
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
                </tr>
                <tr className="border-bottom-0">
                  <td colSpan={1}></td>
                  <td colSpan={3}>
                    {caseDetail.calendarNotes && (
                      <span>
                        <span className="text-bold margin-right-1">
                          Calendar Notes:{' '}
                        </span>
                        {caseDetail.calendarNotes}
                      </span>
                    )}
                  </td>
                </tr>
                <tr className="blank-note-row">
                  <td colSpan={7}></td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
