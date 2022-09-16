const React = require('react');
import { PrimaryHeader } from '../components/PrimaryHeader';
import { ReportsHeader } from '../components/ReportsHeader';
import { SessionNotesSection } from '../components/SessionNotesSection';

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
    statusUnassigned: 'Status Unassigned',
    takenUnderAdvisement: 'Taken Under Advisement',
  };
  const selectedFilters = [];

  Object.keys(filters).map(key => {
    if (filterMap[key]) {
      selectedFilters.push(filterMap[key]);
    }
  });

  return selectedFilters;
};

export const PrintableWorkingCopySessionList = ({
  caseNotesFlag,
  filters,
  formattedCases,
  formattedTrialSession,
  sessionNotes,
}) => {
  console.log('formattedTrialSession*** ', formattedTrialSession);
  const trialSessionDateRange =
    formattedTrialSession.formattedEstimatedEndDateFull
      ? `${formattedTrialSession.formattedStartDateFull} - ${formattedTrialSession.formattedEstimatedEndDateFull}`
      : `${formattedTrialSession.formattedStartDateFull}`;
  const selectedFilters = generateSelectedFilterList(filters);
  return (
    <div className="printable-working-copy-list">
      <PrimaryHeader />
      <ReportsHeader
        subtitle={trialSessionDateRange}
        title={formattedTrialSession.trialLocation}
      />

      <div>
        {/*TrialSessionDetailHeader*/}
        <div className="big-blue-header">
          <div className="grid-container">
            <p className="margin-y-0" id="case-title"></p>
          </div>
        </div>
        {/*TrialSessionWorkingCopy*/}
        <section className="usa-section grid-container">
          <div className="grid-row">
            <div className="grid-col-9">
              <h2 className="heading-1">{`${formattedTrialSession.formattedJudge} - Session Copy`}</h2>
            </div>
          </div>
          {/*SessionNotes*/}
          <SessionNotesSection sessionNotes={sessionNotes} />
          {/*SelectedFilters*/}
          <table>
            <thead>
              <tr>
                <th
                  aria-label="Docket Number"
                  className="padding-left-2px no-wrap"
                  colSpan="4"
                >
                  Trial Status Filters Selected
                </th>
                <th>Total Shown: {formattedCases.length}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-bottom-0">
                <td>{selectedFilters[0] || ''}</td>
                <td>{selectedFilters[2] || ''}</td>
                <td>{selectedFilters[4] || ''}</td>
                <td>{selectedFilters[6] || ''}</td>
                <td>{selectedFilters[8] || ''}</td>
              </tr>
              <tr>
                <td>{selectedFilters[1] || ''}</td>
                <td>{selectedFilters[3] || ''}</td>
                <td>{selectedFilters[5] || ''}</td>
                <td colSpan="2">{selectedFilters[7] || ''}</td>
              </tr>
            </tbody>
          </table>
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
                    <tr className="border-bottom-0 border-top-0">
                      <td colSpan="2"></td>
                      <td colSpan="5">
                        {formattedCase.calendarNotes &&
                          `Calendar Notes: ${formattedCase.calendarNotes}`}
                      </td>
                    </tr>
                    <tr className="border-bottom-0 border-top-0">
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
    </div>
  );
};
