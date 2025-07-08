import { BigHeader } from '../BigHeader';
import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { DateRangePickerComponent } from '../../ustc-ui/DateInput/DateRangePickerComponent';
import { ErrorNotification } from '../ErrorNotification';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useRef, useState } from 'react';

export const CaseDeadlines = connect(
  {
    caseDeadlineReport: state.caseDeadlineReport,
    caseDeadlineReportHelper: state.caseDeadlineReportHelper,
    filterCaseDeadlinesByJudgeSequence:
      sequences.filterCaseDeadlinesByJudgeSequence,
    selectDateRangeFromCalendarSequence:
      sequences.selectDateRangeFromCalendarSequence,
    updateDateRangeForDeadlinesSequence:
      sequences.updateDateRangeForDeadlinesSequence,
    updateCaseDeadlineReportPageSequence:
      sequences.updateCaseDeadlineReportPageSequence,
    updateScreenMetadataSequence:
      sequences.updateScreenMetadataSequence,
    validationErrors: state.validationErrors,
  },
  function CaseDeadlines({
    caseDeadlineReport,
    caseDeadlineReportHelper,
    filterCaseDeadlinesByJudgeSequence,
    selectDateRangeFromCalendarSequence,
    updateDateRangeForDeadlinesSequence,
    updateCaseDeadlineReportPageSequence,
    updateScreenMetadataSequence,
    validationErrors,
  }) {
    const paginatorTop = useRef(null);
    const [activePage, setActivePage] = useState(0);

    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="title">
            <h1>Deadlines</h1>
          </div>
          <h2>{caseDeadlineReportHelper.formattedFilterStartDateHeader} - {caseDeadlineReportHelper.formattedFilterEndDateHeader}</h2>
          <div className="grid-row grid-gap">
            <DateRangePickerComponent
              endDateErrorText={validationErrors.endDate}
              endName="deadlineEnd"
              endValue={caseDeadlineReportHelper.filterEndDate}
              // initialEndValue={caseDeadlineReportHelper.filterEndDate}
              // initialStartValue={caseDeadlineReportHelper.filterStartDate}
              rangePickerCls={'display-flex flex-wrap gap-2'}
              startDateErrorText={validationErrors.startDate}
              startName="deadlineStart"
              startValue={caseDeadlineReportHelper.filterStartDate}
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
              onLoad={() => {
                updateScreenMetadataSequence({ key: 'filterEndDateState', value: caseDeadlineReportHelper.filterEndDate })
                updateScreenMetadataSequence({ key: 'filterStartDateState', value: caseDeadlineReportHelper.filterStartDate })
              }}
            />
            <div>
              <label className="usa-label" htmlFor="judges-filter">
                Judge
              </label>
              <BindedSelect
                aria-describedby="case-deadlines-tab case-deadlines-filter-label"
                aria-label="judge filter"
                className="select-left width-card-lg"
                name="judges"
                placeholder="Buch"
                value={caseDeadlineReportHelper.selectedJudgeFilterValue}
                onChange={e => {
                  filterCaseDeadlinesByJudgeSequence({
                    selectedJudgeId: e,
                  })
                  setActivePage(0);
                }}
              >
                {caseDeadlineReportHelper.judgeOptions.map(judgeOption => (
                  <option key={judgeOption.id} value={judgeOption.id}>
                    {judgeOption.name}
                  </option>
                ))}
              </BindedSelect>
            </div>
            <div>
              <label className="usa-label" htmlFor="judges-filter-button">&shy;</label>
              <Button
                data-testid="submit-case-deadlines-report-button"
                onClick={() => {
                  updateDateRangeForDeadlinesSequence();
                  setActivePage(0);
                }}
              >
                Run Report
              </Button>
            </div>
          </div>
          <div>
            <div ref={paginatorTop}>
              {caseDeadlineReportHelper.pageCount > 1 && (
                <Paginator
                  currentPageIndex={activePage}
                  totalPages={caseDeadlineReportHelper.pageCount}
                  onPageChange={pageChange => {
                    setActivePage(pageChange);
                    updateCaseDeadlineReportPageSequence({
                      selectedPage: pageChange,
                    });
                    focusPaginatorTop(paginatorTop);
                  }}
                />
              )}
            </div>
            <div className="margin-bottom-2">
              <div className="text-right">
                <span className="text-semibold">
                  Count: {caseDeadlineReport.caseDeadlinesTotalCount}
                </span>
              </div>
            </div>
            {caseDeadlineReportHelper.formattedCaseDeadlines.length > 0 && (
              <table className="usa-table subsection ustc-table deadlines">
                <thead>
                  <tr>
                    <th>Due Date</th>
                    <th
                      aria-hidden="true"
                      className="consolidated-case-column"
                    ></th>
                    <th aria-label="Docket number">Docket No.</th>
                    <th>Case Title</th>
                    <th>Description</th>
                    <th>Judge</th>
                  </tr>
                </thead>
                <tbody>
                  {caseDeadlineReportHelper.formattedCaseDeadlines.map(
                    row => (
                      <tr key={row.caseDeadlineId}>
                        <td className="smaller-column">
                          {row.formattedDeadline}
                        </td>
                        <td className="consolidated-case-column">
                          <ConsolidatedCaseIcon
                            consolidatedIconTooltipText={
                              row.consolidatedIconTooltipText
                            }
                            inConsolidatedGroup={row.inConsolidatedGroup}
                            showLeadCaseIcon={row.inLeadCase}
                          />
                        </td>
                        <td className="smaller-column">
                          <CaseLink formattedCase={row} />
                        </td>
                        <td>{row.caseTitle}</td>
                        <td className="padding-extra">{row.description}</td>
                        <td className="no-wrap">
                          {row.associatedJudgeFormatted}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            )}
            {caseDeadlineReportHelper.pageCount > 1 && (
              <Paginator
                currentPageIndex={activePage}
                totalPages={caseDeadlineReportHelper.pageCount}
                onPageChange={pageChange => {
                  setActivePage(pageChange);
                  updateCaseDeadlineReportPageSequence({
                    selectedPage: pageChange,
                  });
                  focusPaginatorTop(paginatorTop);
                }}
              />
            )}
            {caseDeadlineReportHelper.showNoDeadlines && (
              <p>There are no deadlines for the selected date(s).</p>
            )}
          </div>
        </section>
      </>
    );
  },
);

CaseDeadlines.displayName = 'CaseDeadlines';
