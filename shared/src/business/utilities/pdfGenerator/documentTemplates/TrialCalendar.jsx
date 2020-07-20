const React = require('react');
const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');
const { ReportsHeader } = require('../components/ReportsHeader.jsx');

export const TrialCalendar = ({ cases, sessionDetail }) => {
  return (
    <>
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

        <div className="card width-half" id="assignments">
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
            <div className="width-half">
              <strong>Court Reporter</strong>
              <div>{sessionDetail.courtReporter}</div>
            </div>
            <div className="width-half">
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
        <div className="card-content">{sessionDetail.notes}</div>
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
          </tr>
        </thead>
        <tbody>
          {cases &&
            cases.map(caseDetail => {
              return (
                <tr key={caseDetail.docketNumber}>
                  <td>{caseDetail.docketNumber}</td>
                  <td>{caseDetail.caseTitle}</td>
                  <td>
                    {caseDetail.petitionerCounsel &&
                      caseDetail.petitionerCounsel.map((counsel, idx) => (
                        <div key={idx}>{counsel}</div>
                      ))}
                  </td>
                  <td>
                    {caseDetail.respondentCounsel &&
                      caseDetail.respondentCounsel.map((counsel, idx) => (
                        <div key={idx}>{counsel}</div>
                      ))}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};
