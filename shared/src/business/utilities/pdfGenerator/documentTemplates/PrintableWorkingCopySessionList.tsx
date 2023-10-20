import { PrimaryHeader } from '../components/PrimaryHeader';
import { ReportsHeader } from '../components/ReportsHeader';
import { SelectedFiltersSection } from '../components/SelectedFiltersSection';
import { SessionAssignmentsSection } from '../components/SessionAssignmentsSection';
import { SessionNotesSection } from '../components/SessionNotesSection';
import {
  generateCaseStatus,
  isMemberCase,
} from '../../generateSelectedFilterList';
import React from 'react';
import classNames from 'classnames';

export const PrintableWorkingCopySessionList = ({
  filters,
  formattedCases,
  formattedTrialSession,
  sessionNotes,
  showCaseNotes,
  sort,
  userHeading,
}) => {
  const trialSessionDateRange =
    formattedTrialSession.formattedEstimatedEndDateFull
      ? `${formattedTrialSession.formattedStartDateFull} - ${formattedTrialSession.formattedEstimatedEndDateFull}`
      : `${formattedTrialSession.formattedStartDateFull}`;

  return (
    <div className="printable-working-copy-list">
      <PrimaryHeader />
      <ReportsHeader
        subtitle={trialSessionDateRange}
        title={formattedTrialSession.trialLocation}
      />
      <section className="usa-section grid-container">
        <div className="grid-row grid-gap">
          <div className="grid-col-9">
            <h2 className="heading-1">{userHeading}</h2>
          </div>
        </div>

        <SessionAssignmentsSection
          formattedTrialSession={formattedTrialSession}
        />
        <SessionNotesSection sessionNotes={sessionNotes} />
        <SelectedFiltersSection
          count={formattedCases.length}
          selectedFilters={filters}
        />

        <table>
          <thead>
            <tr>
              <th
                aria-label="Docket Number"
                className="padding-left-2px no-wrap"
              >
                <span className={classNames(sort === 'docket' && 'sortActive')}>
                  Docket No.
                </span>
              </th>
              <th>Case Title</th>
              <th>
                <span
                  className={classNames(
                    sort === 'practitioner' && 'sortActive',
                  )}
                >
                  Petitioner Counsel
                </span>
              </th>
              <th>Respondent Counsel</th>
              <th>PTM</th>
              <th colSpan={2}>Trial Status</th>
            </tr>
          </thead>
          <tbody>
            {formattedCases.map(formattedCase => {
              const memberCase = isMemberCase(formattedCase);
              return (
                <React.Fragment key={formattedCase.docketNumber}>
                  <tr className="padding-bottom-2 content-row">
                    <td
                      className={`${
                        memberCase ? 'margin-left-2' : ''
                      } docket-number-with-icon`}
                    >
                      <div
                        className={classNames(
                          `${
                            formattedCase.isLeadCase && 'lead-consolidated-icon'
                          } ${memberCase && 'consolidated-icon'}`,
                        )}
                        style={{ marginRight: '0.3rem' }}
                      />
                      <div>{formattedCase.docketNumberWithSuffix}</div>
                    </td>
                    <td className="wrap-text-content">
                      {formattedCase.caseTitle}
                    </td>
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
                    <td>{formattedCase.filingPartiesCode}</td>
                    <td>{generateCaseStatus(formattedCase.trialStatus)}</td>
                  </tr>
                  <tr className="border-bottom-0 border-top-0">
                    <td colSpan={1}></td>
                    <td colSpan={5}>
                      {formattedCase.calendarNotes && (
                        <span>
                          <span className="text-bold margin-right-1">
                            Calendar Notes:
                          </span>
                          {formattedCase.calendarNotes}
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-bottom-0 border-top-0">
                    <td colSpan={1}></td>
                    <td colSpan={5}>
                      {showCaseNotes && formattedCase.userNotes && (
                        <span>
                          <span className="text-bold margin-right-1">
                            Notes:
                          </span>
                          {formattedCase.userNotes}
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
      </section>
    </div>
  );
};
