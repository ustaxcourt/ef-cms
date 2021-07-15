import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { DateRangePickerComponent } from './DateRangePickerComponent';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseDeadlines = connect(
  {
    caseDeadlineReport: state.caseDeadlineReport,
    caseDeadlineReportHelper: state.caseDeadlineReportHelper,
    filterCaseDeadlinesByJudgeSequence:
      sequences.filterCaseDeadlinesByJudgeSequence,
    judgeFilter: state.screenMetadata.caseDeadlinesFilter.judge,
    loadMoreCaseDeadlinesSequence: sequences.loadMoreCaseDeadlinesSequence,
    screenMetadata: state.screenMetadata,
    selectDateRangeFromCalendarSequence:
      sequences.selectDateRangeFromCalendarSequence,
    updateDateRangeForDeadlinesSequence:
      sequences.updateDateRangeForDeadlinesSequence,
    validationErrors: state.validationErrors,
  },
  function CaseDeadlines({
    caseDeadlineReport,
    caseDeadlineReportHelper,
    filterCaseDeadlinesByJudgeSequence,
    loadMoreCaseDeadlinesSequence,
    screenMetadata,
    selectDateRangeFromCalendarSequence,
    updateDateRangeForDeadlinesSequence,
    validationErrors,
  }) {
    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="title">
            <h1>Deadlines</h1>
          </div>
          <div className="grid-row grid-gap">
            <div className="grid-col-3">
              <div className="header-with-blue-background">
                <h3>Show Deadlines by Date(s)</h3>
              </div>
              <div className="blue-container">
                <DateRangePickerComponent
                  endDateErrorText={validationErrors.endDate}
                  endName="deadlineEnd"
                  endValue={screenMetadata.filterEndDateState}
                  startDateErrorText={validationErrors.startDate}
                  startName="deadlineStart"
                  startValue={screenMetadata.filterStartDateState}
                  onChangeEnd={e => {
                    selectDateRangeFromCalendarSequence({
                      endDate: e.target.value,
                    });
                  }}
                  onChangeStart={e => {
                    selectDateRangeFromCalendarSequence({
                      startDate: e.target.value,
                    });
                  }}
                />
                <Button
                  id="update-date-range-deadlines-button"
                  onClick={() => {
                    updateDateRangeForDeadlinesSequence();
                  }}
                >
                  Show Deadlines
                </Button>
              </div>
            </div>
            <div className="grid-col-9">
              <div className="grid-row">
                <div className="grid-col-6">
                  <h2>{caseDeadlineReportHelper.formattedFilterDateHeader}</h2>
                </div>
                <div className="grid-col-6 text-right margin-top-1">
                  <span className="text-semibold">
                    Count: {caseDeadlineReportHelper.totalCount}
                  </span>
                </div>
              </div>
              {caseDeadlineReportHelper.showJudgeSelect && (
                <div className="grid-row grid-gap padding-bottom-1">
                  <div className="grid-col-3 tablet:grid-col-2 padding-top-05">
                    <h3 id="filterHeading">Filter by</h3>
                  </div>
                  <div className="grid-col-3">
                    <select
                      aria-describedby="case-deadlines-tab filterHeading"
                      aria-label="judge"
                      className="usa-select select-left"
                      id="judgeFilter"
                      name="judge"
                      placeholder="- Judge -"
                      value={caseDeadlineReport.judgeFilter}
                      onChange={e =>
                        filterCaseDeadlinesByJudgeSequence({
                          judge: e.target.value,
                        })
                      }
                    >
                      <option value="">-Judge-</option>
                      {caseDeadlineReportHelper.judges.map(judge => (
                        <option key={judge} value={judge}>
                          {judge}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {caseDeadlineReportHelper.caseDeadlines.length > 0 && (
                <table className="usa-table subsection ustc-table deadlines">
                  <thead>
                    <tr>
                      <th>Due Date</th>
                      <th aria-label="docket number">Docket No.</th>
                      <th>Case Title</th>
                      <th>Description</th>
                      <th>Judge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caseDeadlineReportHelper.caseDeadlines.map(item => (
                      <tr key={item.caseDeadlineId}>
                        <td className="smaller-column semi-bold">
                          {item.formattedDeadline}
                        </td>
                        <td className="smaller-column semi-bold">
                          <CaseLink formattedCase={item} />
                        </td>
                        <td>{item.caseTitle}</td>
                        <td className="padding-extra">{item.description}</td>
                        <td className="no-wrap">
                          {item.associatedJudgeFormatted}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {caseDeadlineReportHelper.showNoDeadlines && (
                <p>There are no deadlines for the selected date(s).</p>
              )}
              {caseDeadlineReportHelper.showLoadMoreButton && (
                <Button
                  secondary
                  className="margin-bottom-20"
                  id="load-more-deadlines-button"
                  onClick={() => {
                    loadMoreCaseDeadlinesSequence();
                  }}
                >
                  Load More
                </Button>
              )}
            </div>
          </div>
        </section>
      </>
    );
  },
);
