const React = require('react');
import { PrimaryHeader } from '../components/PrimaryHeader';
import { ReportsHeader } from '../components/ReportsHeader';
import { SessionNotesSection } from '../components/SessionNotesSection';

const isMemberCase = formattedCase => {
  return formattedCase.inConsolidatedGroup && !formattedCase.leadCase;
};

const orderedFilterMap = [
  {
    code: 'setForTrial',
    name: 'Set For Trial',
  },
  {
    code: 'dismissed',
    name: 'Dismissed',
  },
  {
    code: 'continued',
    name: 'Continued',
  },
  {
    code: 'rule122',
    name: 'Rule 122',
  },
  {
    code: 'aBasisReached',
    name: 'A Basis Reached',
  },
  {
    code: 'settled',
    name: 'Settled',
  },
  {
    code: 'recall',
    name: 'Recall',
  },
  {
    code: 'takenUnderAdvisement',
    name: 'Taken Under Advisement',
  },
  {
    code: 'statusUnassigned',
    name: 'Status Unassigned',
  },
];

const generateSelectedFilterList = filters => {
  const selectedFilters = [];
  const filterKeys = Object.keys(filters).filter(
    filterKey => filterKey !== 'showAll',
  );
  const userFilterSelection = filterKeys.filter(
    filterKey => filters[filterKey],
  );

  orderedFilterMap.map(orderedFilterKey => {
    const nameOfFilter = orderedFilterKey.code;
    if (userFilterSelection.indexOf(nameOfFilter) > -1) {
      selectedFilters.push(orderedFilterKey.name);
    }
  });
  return selectedFilters;
};

const generateCaseStatus = trialStatus => {
  const foundTrialStatusFromMap = orderedFilterMap.find(
    orderedFilterKey => orderedFilterKey.code === trialStatus,
  );
  return foundTrialStatusFromMap?.name || 'Unassigned';
};

export const PrintableWorkingCopySessionList = ({
  filters,
  formattedCases,
  formattedTrialSession,
  sessionNotes,
  showCaseNotes,
}) => {
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
      <section className="usa-section grid-container">
        <div className="grid-row">
          <div className="grid-col-9">
            <h2 className="heading-1">{`${formattedTrialSession.formattedJudge} - Session Copy`}</h2>
          </div>
        </div>
        <SessionNotesSection sessionNotes={sessionNotes} />
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
              const memberCase = isMemberCase(formattedCase);
              return (
                <React.Fragment key={formattedCase.docketNumber}>
                  <tr className="vertical-align-middle-row padding-bottom-2 content-row">
                    <td className="consolidated-case-column">
                      {formattedCase.leadCase && 'LC'}
                      {memberCase && <span className="margin-left-2">🔗</span>}
                    </td>
                    <td>
                      <div className={memberCase ? 'margin-left-2' : ''}>
                        {formattedCase.docketNumberWithSuffix}
                      </div>
                    </td>
                    <td className="minw-80">{formattedCase.caseTitle}</td>
                    <td>
                      {formattedCase.privatePractitioners.map(practitioner => (
                        <div key={practitioner.userId}>{practitioner.name}</div>
                      ))}
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
                      {generateCaseStatus(formattedCase.trialStatus)}
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
                      {showCaseNotes &&
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
  );
};
