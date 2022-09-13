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
      <div>
        {/*TrialSessionDetailHeader*/}
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="margin-bottom-1">
              <h1 tabIndex="-1">{formattedTrialSession.trialLocation}</h1>
              <span className="usa-tag">
                <span aria-hidden="true">
                  {formattedTrialSession.formattedTerm}:{' '}
                  {formattedTrialSession.computedStatus}
                </span>
              </span>
            </div>
            <p className="margin-y-0" id="case-title">
              <span>
                {formattedTrialSession.formattedStartDate}
                {formattedTrialSession.formattedEstimatedEndDate &&
                  ` - ${formattedTrialSession.formattedEstimatedEndDate}`}
              </span>
            </p>
          </div>
        </div>
        {/*TrialSessionWorkingCopy*/}
        <section className="usa-section grid-container">
          <div className="grid-row">
            <div className="grid-col-9">
              <h2 className="heading-1">{nameToDisplay} - Session Copy</h2>
              <h2>Number of formatted cases: {formattedCases.length}</h2>
            </div>
          </div>
          {/*SessionNotes*/}
          {/*TODO: CHECK NEED FOR RENDERING SESSIONS NOTES IF THERE ARE NO SESSION NOTES*/}
          <div className="case-notes">
            <div className="grid-container padding-x-0">
              <div className="grid-row grid-gap">
                <div className="tablet:grid-col-6">
                  <div className="card">
                    <div className="content-wrapper">
                      <SessionNotesSection sessionNotes={sessionNotes} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                        {console.log(
                          'caseNotesFlag:::::',
                          typeof caseNotesFlag,
                        )}
                        {console.log(
                          'formattedCase.notes:::::',
                          formattedCase.notes,
                        )}
                        {caseNotesFlag &&
                          formattedCase.notes &&
                          formattedCase.notes.notes}
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
