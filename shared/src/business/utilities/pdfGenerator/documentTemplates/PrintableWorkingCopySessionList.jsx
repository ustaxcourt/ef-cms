const React = require('react');

const isMemberCase = formattedCase => {
  if (formattedCase.inConsolidatedGroup && !formattedCase.leadCase) {
    return true;
  }
  return false;
};

export const PrintableWorkingCopySessionList = ({
  formattedCases,
  formattedTrialSession,
  nameToDisplay,
}) => {
  return (
    <div id="printable-working-copy-list">
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
        <div className="case-notes">
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-6">
                <div className="card">
                  <div className="content-wrapper">
                    <h3 className="display-inline">Session Notes</h3>
                    {/*TODO: Add session notes*/}
                    {/*<If bind="trialSessionWorkingCopy.sessionNotes">*/}
                    {/*  <div className="margin-top-1  margin-bottom-4">*/}
                    {/*    <TextView bind="trialSessionWorkingCopy.sessionNotes" />*/}
                    {/*  </div>*/}
                    {/*</If>*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                      <div className={indentMemberCase ? 'margin-left-2' : ''}>
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
                      {formattedCase.trialStatus || 'Unassigned'}
                    </td>
                  </tr>
                  <tr className="case-note-row">
                    <td colSpan="2"></td>
                    <td colSpan="5">
                      {formattedCase.notes && formattedCase.notes.notes}
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

// export const printableTrialSessionWorkingCopyHelper = ({ trialSession }) => {
//   const compareCasesByPractitioner = (a, b) => {
//     const aCount =
//       (a.privatePractitioners && a.privatePractitioners.length && 1) || 0;
//     const bCount =
//       (b.privatePractitioners && b.privatePractitioners.length && 1) || 0;

//     return aCount - bCount;
//   };

//   const { STATUS_TYPES, TRIAL_STATUS_TYPES } =
//     applicationContext.getConstants();

//   const { caseMetadata, filters, sort, sortOrder, userNotes } = get(
//     state.trialSessionWorkingCopy,
//   );

//   //get an array of strings of the trial statuses that are set to true
//   const trueFilters = Object.keys(pickBy(filters));

//   let formattedCases = (trialSession.calendaredCases || [])
//     .slice()
//     .filter(
//       calendaredCase =>
//         calendaredCase.status !== STATUS_TYPES.closed &&
//         calendaredCase.removedFromTrial !== true,
//     )
//     .filter(
//       calendaredCase =>
//         (trueFilters.includes('statusUnassigned') &&
//           (!caseMetadata[calendaredCase.docketNumber] ||
//             !caseMetadata[calendaredCase.docketNumber].trialStatus)) ||
//         (caseMetadata[calendaredCase.docketNumber] &&
//           trueFilters.includes(
//             caseMetadata[calendaredCase.docketNumber].trialStatus,
//           )),
//     )
//     .map(caseItem =>
//       applicationContext
//         .getUtilities()
//         .formatCaseForTrialSession({ applicationContext, caseItem }),
//     )
//     .sort(applicationContext.getUtilities().compareCasesByDocketNumber);

//   Object.keys(userNotes || {}).forEach(docketNumber => {
//     const caseToUpdate = formattedCases.find(
//       aCase => aCase.docketNumber === docketNumber,
//     );
//     if (caseToUpdate) {
//       caseToUpdate.userNotes = userNotes[docketNumber].notes;
//     }
//   });

//   trialSession.caseOrder.forEach(aCase => {
//     if (aCase.calendarNotes) {
//       const caseToUpdate = formattedCases.find(
//         theCase => theCase.docketNumber === aCase.docketNumber,
//       );
//       if (caseToUpdate) {
//         caseToUpdate.calendarNotes = aCase.calendarNotes;
//       }
//     }
//   });

//   const [leadAndUnconsolidatedCases, memberConsolidatedCases] = partition(
//     formattedCases,
//     calendaredCase => {
//       return (
//         !calendaredCase.leadDocketNumber ||
//         calendaredCase.docketNumber === calendaredCase.leadDocketNumber
//       );
//     },
//   );

//   leadAndUnconsolidatedCases.forEach(caseToUpdate => {
//     if (caseToUpdate.leadCase) {
//       caseToUpdate.consolidatedCases = memberConsolidatedCases.filter(
//         memberCase => {
//           return memberCase.leadDocketNumber === caseToUpdate.leadDocketNumber;
//         },
//       );

//       caseToUpdate.consolidatedCases.sort(
//         applicationContext.getUtilities().compareCasesByDocketNumber,
//       );
//     }
//   });

//   if (sort === 'practitioner') {
//     leadAndUnconsolidatedCases.sort(compareCasesByPractitioner);
//   }

//   if (sortOrder === 'desc') {
//     leadAndUnconsolidatedCases.reverse();
//   }

//   const trialStatusOptions = TRIAL_STATUS_TYPES.map(value => ({
//     key: camelCase(value),
//     value,
//   }));
//   const formattedCasesFromHelper = leadAndUnconsolidatedCases;
//   return formattedCasesFromHelper;
// };
