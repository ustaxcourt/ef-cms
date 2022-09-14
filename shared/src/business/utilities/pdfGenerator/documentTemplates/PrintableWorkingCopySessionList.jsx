import { SessionNotesSection } from '../components/SessionNotesSection';

const React = require('react');

const isMemberCase = formattedCase => {
  if (formattedCase.inConsolidatedGroup && !formattedCase.leadCase) {
    return true;
  }
  return false;
};

const generateSelectedFilterList = filters => {
  const filterMap = {
    aBasisReached: 'A Basis Reached',
    continued: 'Continued',
    dismissed: 'Dismissed',
    recall: 'Recall',
    rule122: 'Rule 122',
    setForTrial: 'Set For Trial',
    settled: 'Settled',
    showAll: 'Show All',
    statusUnassigned: 'Status Unassigned',
    takenUnderAdvisement: 'Taken Under Advisement',
  };
  const selectedFilters = [];

  Object.keys(filters).map(key => {
    if (filters[key]) {
      selectedFilters.push(filterMap[key]);
    }
  });

  return selectedFilters.join(', ');
};

export const PrintableWorkingCopySessionList = ({
  caseNotesFlag,
  filters,
  formattedCases,
  formattedTrialSession,
  nameToDisplay,
  sessionNotes,
}) => {
  return (
    <React.Fragment className="printable-working-copy-list">
      {/* Primary Header */}
      <div id="primary-header">
        <div className="us-tax-court-seal"></div>
        <h1>United States Tax Court</h1>
        <div className="court-address">Washington, DC 20217</div>
        <div className="clear"></div>
        <div>
          <h2>{formattedTrialSession.trialLocation}</h2>
          <h3>
            {formattedTrialSession.formattedStartDate}
            {formattedTrialSession.formattedEstimatedEndDate &&
              ` - ${formattedTrialSession.formattedEstimatedEndDate}`}
          </h3>
        </div>
      </div>
      <div>
        {/*TrialSessionDetailHeader*/}
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="margin-bottom-1">
              <span className="usa-tag">
                <span aria-hidden="true">
                  {formattedTrialSession.formattedTerm}:{' '}
                  {formattedTrialSession.computedStatus}
                </span>
              </span>
            </div>
            <p className="margin-y-0" id="case-title"></p>
          </div>
        </div>
        {/*TrialSessionWorkingCopy*/}
        <section className="usa-section grid-container">
          <div className="grid-row">
            <div className="grid-col-9">
              <h2 className="heading-1">{nameToDisplay} - Session Copy</h2>
            </div>
          </div>
          {/*SessionNotes*/}
          <SessionNotesSection sessionNotes={sessionNotes} />
          {/*SelectedFilters*/}
          <div>Filters Selected: {generateSelectedFilterList(filters)}</div>
          {/*WorkingCopySessionList*/}
          <table>
            <thead>
              <tr>
                <th></th>
                <th
                  aria-label="Docket Number"
                  className="padding-left-2px no-wrap"
                >
                  Docket No.
                </th>
                <th>Case Title</th>
                <th>Petitioner Counsel</th>
                <th>Respondent Counsel</th>
                <th>PTM</th>
                <th colSpan="2">Trial Status</th>
              </tr>
            </thead>
            <tbody>
              {formattedCases.map(formattedCase => {
                const indentMemberCase = isMemberCase(formattedCase);
                return (
                  <React.Fragment key={formattedCase.docketNumber}>
                    <tr className="vertical-align-middle-row padding-bottom-2 content-row">
                      <td className="consolidated-case-column">
                        {formattedCase.leadCase && <span>LC</span>}
                      </td>
                      <td>
                        <div
                          className={indentMemberCase ? 'margin-left-2' : ''}
                        >
                          {formattedCase.docketNumberWithSuffix}
                        </div>
                      </td>
                      <td className="minw-80">{formattedCase.caseTitle}</td>
                      <td>
                        {formattedCase.privatePractitioners.map(
                          practitioner => (
                            <div key={practitioner.userId}>
                              {practitioner.name}
                            </div>
                          ),
                        )}
                      </td>
                      <td>
                        {formattedCase.irsPractitioners.map(respondent => (
                          <div key={respondent.userId}>{respondent.name}</div>
                        ))}
                      </td>
                      <td className="minw-10">
                        {formattedCase.filingPartiesCode}
                      </td>
                      <td className="minw-30">
                        {formattedCase.trialStatus || 'Unassigned'}
                      </td>
                    </tr>
                    <tr className="case-note-row">
                      <td colSpan="2"></td>
                      <td colSpan="5">
                        {formattedCase.calendarNotes &&
                          `Calendar Notes: ${formattedCase.calendarNotes}`}
                      </td>
                    </tr>
                    <tr className="case-note-row">
                      <td colSpan="2"></td>
                      <td colSpan="5">
                        {caseNotesFlag &&
                          formattedCase.userNotes &&
                          `Notes: ${formattedCase.userNotes}`}
                      </td>
                    </tr>
                    <tr className="blank-note-row">
                      <td colSpan="7"></td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </React.Fragment>
  );
};
