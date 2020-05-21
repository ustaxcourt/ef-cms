const React = require('react');

const { PrimaryHeader } = require('../components/PrimaryHeader.jsx');
const { ReportsHeader } = require('../components/ReportsHeader.jsx');

export const TrialCalendar = ({ cases, sessionDetail }) => {
  return (
    <>
      <PrimaryHeader />
      <ReportsHeader
        subtitle={`${sessionDetail.startDate} ${sessionDetail.type}`}
        title={sessionDetail.locationName}
      />

      <div>
        <div className="card width-half float-left">
          <div className="card-header">Trial Information</div>
          <div className="card-content">
            <div className="width-half float-left" id="start-time">
              <strong>Start Time</strong>
              <br />
              {sessionDetail.startTime}
            </div>
            <div className="width-half float-right" id="location">
              <strong>Location</strong>
              {sessionDetail.noLocationEntered && (
                <div>No location entered</div>
              )}
              {!sessionDetail.noLocationEntered && (
                <>
                  {sessionDetail.courthouseName && (
                    <p>{sessionDetail.courthouseName}</p>
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

        <div className="card width-half float-right" id="assignments">
          <div className="card-header">Assignments</div>
          <div className="card-content">
            <div>
              <div className="width-half float-left">
                <strong>Judge</strong>
                <div>{sessionDetail.judge}</div>
              </div>
              <div className="width-half float-right">
                <strong>Trial Clerk</strong>
                <div>{sessionDetail.trialClerk}</div>
              </div>
              <div className="clear"></div>
            </div>
            <div>
              <div className="width-half float-left">
                <strong>Court Reporter</strong>
                <div>{sessionDetail.courtReporter}</div>
              </div>
              <div className="width-half float-right">
                <strong>IRS Calendar Administrator</strong>
                <div>{sessionDetail.irsCalendarAdministrator}</div>
              </div>
              <div className="clear"></div>
            </div>
          </div>
        </div>
        <div className="clear"></div>
      </div>

      <div className="card" id="notes">
        <div className="card-header">Session Notes</div>
        <div className="card-content">{sessionDetail.notes}</div>
      </div>

      <h4 className="text-center" id="cases-count">
        Open Cases ({cases.length})
      </h4>

      <table>
        <thead>
          <tr>
            <th>Docket no.</th>
            <th>Case Title</th>
            <th>Petitioner counsel</th>
            <th>Respondent counsel</th>
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
