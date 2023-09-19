import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { DateRangePickerComponent } from '../../ustc-ui/DateInput/DateRangePickerComponent';
import { ErrorNotification } from '../ErrorNotification';
import { Paginator } from '../../ustc-ui/Pagination/Paginator';
import { connect } from '@cerebral/react';
import { formatPositiveNumber } from '../../../../shared/src/business/utilities/formatPositiveNumber';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React, { useState } from 'react';

export const JudgeActivityReport = connect(
  {
    getCavAndSubmittedCasesForJudgesSequence:
      sequences.getCavAndSubmittedCasesForJudgesSequence,
    judgeActivityReport: state.judgeActivityReport,
    judgeActivityReportData: state.judgeActivityReport.judgeActivityReportData,
    judgeActivityReportFilters: state.judgeActivityReport.filters,
    judgeActivityReportHelper: state.judgeActivityReportHelper,
    judgeActivityReportJudges: state.judges,
    setJudgeActivityReportFiltersSequence:
      sequences.setJudgeActivityReportFiltersSequence,
    submitJudgeActivityReportSequence:
      sequences.submitJudgeActivityReportSequence,
    validationErrors: state.validationErrors,
  },
  function JudgeActivityReport({
    getCavAndSubmittedCasesForJudgesSequence,
    judgeActivityReport,
    judgeActivityReportData,
    judgeActivityReportFilters,
    judgeActivityReportHelper,
    judgeActivityReportJudges,
    setJudgeActivityReportFiltersSequence,
    submitJudgeActivityReportSequence,
    validationErrors,
  }) {
    const [activePage, setActivePage] = useState(0);
    const ClosedCases: () => JSX.Element = () => (
      <>
        <table aria-describedby="casesClosed" className="usa-table ustc-table">
          <caption id="casesClosed">
            <div className="grid-row display-flex flex-row flex-align-end">
              <div className="grid-col-9 table-caption-serif">
                Cases Closed{' '}
              </div>
              <div className="display-flex flex-column flex-align-end grid-col-fill text-semibold">
                Total:{' '}
                {formatPositiveNumber(
                  judgeActivityReportHelper.closedCasesTotal,
                )}
              </div>
            </div>
          </caption>
          <thead>
            <tr>
              <th aria-label="case type">Case Type</th>
              <th aria-label="case type total">Case Type Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(
              judgeActivityReportData.casesClosedByJudge.aggregations,
            ).map(([status, count]) => (
              <tr key={status}>
                <td>{status}</td>
                <td>{formatPositiveNumber(count)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );

    const TrialSessionsHeld: () => JSX.Element = () => (
      <>
        <table aria-describedby="sessionsHeld" className="usa-table ustc-table">
          <caption id="sessionsHeld">
            <div className="grid-row display-flex flex-row flex-align-end">
              <div className="grid-col-9 table-caption-serif">
                Sessions Held
              </div>
              <div className="display-flex flex-column flex-align-end grid-col-fill text-semibold">
                Total:{' '}
                {formatPositiveNumber(
                  judgeActivityReportHelper.trialSessionsHeldTotal,
                )}
              </div>
            </div>
          </caption>

          <thead>
            <tr>
              <th aria-label="session type">Session Type</th>
              <th aria-label="session type total">Session Type Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(
              judgeActivityReportData.trialSessions.aggregations,
            ).map(([sessionStatus, count]) => (
              <tr key={sessionStatus}>
                <td>{sessionStatus}</td>
                <td>{formatPositiveNumber(count)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );

    const OrdersIssued: () => JSX.Element = () => (
      <>
        <table aria-describedby="ordersIssued" className="usa-table ustc-table">
          <caption id="ordersIssued">
            <div className="grid-row display-flex flex-row flex-align-end">
              <div className="grid-col-9 table-caption-serif">
                Orders Issued
              </div>
              <div className="display-flex flex-column flex-align-end grid-col-fill text-semibold">
                Total:{' '}
                {formatPositiveNumber(
                  judgeActivityReportHelper.ordersFiledTotal,
                )}
              </div>
            </div>
          </caption>
          <thead>
            <tr>
              <th aria-label="event code">Event</th>
              <th aria-label="order type">Order Type</th>
              <th aria-label="event total">Event Total</th>
            </tr>
          </thead>
          <tbody>
            {judgeActivityReportHelper.orders.map(
              ({ count, documentType, eventCode }) => (
                <tr key={eventCode}>
                  <td className="width-15">{eventCode}</td>
                  <td>{documentType}</td>
                  <td>{formatPositiveNumber(count)}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        {judgeActivityReportData.ordersFiledTotal && (
          <p>There are no orders issued for the selected dates</p>
        )}
      </>
    );

    const OpinionsIssued = () => {
      return (
        <>
          <table
            aria-describedby="opinionsIssued"
            className="usa-table ustc-table"
          >
            <caption id="opinionsIssued">
              <div className="grid-row display-flex flex-row flex-align-end">
                <div className="grid-col-9 table-caption-serif">
                  Opinions Issued
                </div>
                <div className="display-flex flex-column flex-align-end grid-col-fill text-semibold">
                  Total:{' '}
                  {formatPositiveNumber(
                    judgeActivityReportHelper.opinionsFiledTotal,
                  )}
                </div>
              </div>
            </caption>
            <thead>
              <tr>
                <th aria-label="event code" className="width-15">
                  Event
                </th>
                <th aria-label="opinion type">Opinion Type</th>
                <th aria-label="event total">Event Total</th>
              </tr>
            </thead>
            <tbody>
              {judgeActivityReportData.opinions.aggregations.map(
                ({ count, documentType, eventCode }) => (
                  <tr key={eventCode}>
                    <td className="width-15">{eventCode}</td>
                    <td>{documentType}</td>
                    <td>{formatPositiveNumber(count)}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </>
      );
    };

    const SubmittedCavCasesTable = () => {
      return (
        <>
          {judgeActivityReportHelper.showPaginator && (
            <Paginator
              breakClassName="hide"
              forcePage={activePage}
              id="paginatorTop"
              marginPagesDisplayed={0}
              pageCount={judgeActivityReportHelper.pageCount}
              pageRangeDisplayed={0}
              onPageChange={async pageChange => {
                setActivePage(pageChange.selected);
                await getCavAndSubmittedCasesForJudgesSequence({
                  selectedPage: pageChange.selected,
                });
                window.document
                  .getElementById('paginatorTop')
                  ?.scrollIntoView();
              }}
            />
          )}
          <table
            aria-describedby="progressDescription"
            className="usa-table ustc-table"
          >
            <caption id="progressDescription">
              <div className="grid-row display-flex flex-row flex-align-end">
                <div className="grid-col-9 table-caption-serif">
                  Submitted/CAV Cases
                </div>
                <div className="display-flex flex-column flex-align-end grid-col-fill text-semibold">
                  Total:{' '}
                  {formatPositiveNumber(
                    judgeActivityReportHelper.progressDescriptionTableTotal,
                  )}
                </div>
              </div>
            </caption>
            <thead>
              <tr>
                <th aria-label="consolidation icon">
                  <span className="usa-sr-only">
                    Consolidated Case Indicator
                  </span>
                </th>
                <th aria-label="docket number">Docket No.</th>
                <th aria-label="opinion type">No. of Cases</th>
                <th aria-label="event total">Petitioner(s)</th>
                <th aria-label="event total">Case Status</th>
                <th aria-label="event total">Days in Status</th>
                <th aria-label="event total">Status Date</th>
                <th aria-label="event total">Final Brief Due Date</th>
                <th aria-label="event total">Status of Matter</th>
              </tr>
            </thead>
            <tbody>
              {judgeActivityReportHelper.submittedAndCavCasesByJudge.map(
                formattedCase => {
                  return (
                    <React.Fragment key={formattedCase.docketNumber}>
                      <tr>
                        <td className="consolidated-case-column">
                          <ConsolidatedCaseIcon
                            consolidatedIconTooltipText={
                              formattedCase.consolidatedIconTooltipText
                            }
                            inConsolidatedGroup={
                              formattedCase.inConsolidatedGroup
                            }
                            showLeadCaseIcon={formattedCase.isLeadCase}
                          />
                        </td>
                        <td>
                          <CaseLink
                            formattedCase={formattedCase}
                            rel="noopener noreferrer"
                            target="_blank"
                          />
                        </td>
                        <td>
                          {formatPositiveNumber(
                            formattedCase?.formattedCaseCount,
                          )}
                        </td>
                        <td>{formattedCase.caseCaption}</td>
                        <td>{formattedCase.status}</td>
                        <td>
                          {formatPositiveNumber(
                            formattedCase.daysElapsedSinceLastStatusChange,
                          )}
                        </td>
                        <td>{formattedCase.statusDate}</td>
                        <td>
                          {
                            formattedCase.caseWorksheet
                              ?.formattedFinalBriefDueDate
                          }
                        </td>
                        <td>{formattedCase.caseWorksheet?.statusOfMatter}</td>
                      </tr>
                      <tr>
                        <td colSpan={3}></td>
                        <td colSpan={7}>
                          <span className="text-bold margin-right-1">
                            Primary Issue:
                          </span>
                          {formattedCase.caseWorksheet?.primaryIssue}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                },
              )}
            </tbody>
          </table>
          {judgeActivityReportHelper.showPaginator && (
            <Paginator
              breakClassName="hide"
              forcePage={activePage}
              id="paginatorBottom"
              marginPagesDisplayed={0}
              pageCount={judgeActivityReportHelper.pageCount}
              pageRangeDisplayed={0}
              onPageChange={async pageChange => {
                setActivePage(pageChange.selected);
                await getCavAndSubmittedCasesForJudgesSequence({
                  selectedPage: pageChange.selected,
                });
                window.document
                  .getElementById('paginatorTop')
                  ?.scrollIntoView();
              }}
            />
          )}
          {judgeActivityReportHelper.progressDescriptionTableTotal === 0 && (
            <p>{'There are no cases with a status of "Submitted" or "CAV".'}</p>
          )}
        </>
      );
    };

    return (
      <>
        <BigHeader text="Reports" />

        <section className="usa-section grid-container">
          <ErrorNotification />

          <div className="title">
            <h1>Activity - {judgeActivityReportHelper.reportHeader}</h1>
          </div>

          <div className="blue-container margin-bottom-30px">
            <div className="grid-row">
              <div className="grid-col-auto margin-x-3">
                <DateRangePickerComponent
                  endDateErrorText={validationErrors.endDate}
                  endName="deadlineEnd"
                  endPickerCls={'grid-col-6 padding-left-2'}
                  endValue={judgeActivityReportFilters.endDate}
                  formGroupCls={'margin-bottom-0'}
                  maxDate={judgeActivityReportHelper.today}
                  rangePickerCls={'grid-row '}
                  startDateErrorText={validationErrors.startDate}
                  startName="deadlineStart"
                  startPickerCls={'grid-col-6 padding-right-2'}
                  startValue=""
                  onChangeEnd={e => {
                    setJudgeActivityReportFiltersSequence({
                      endDate: e.target.value,
                    });
                  }}
                  onChangeStart={e => {
                    setJudgeActivityReportFiltersSequence({
                      startDate: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="grid-col-auto margin-x-3">
                <label
                  className="usa-label"
                  htmlFor="judge-selection"
                  id="judge-selection-label"
                >
                  Judge
                </label>
                <select
                  aria-describedby="judge-selection-label"
                  aria-label="judge"
                  className="usa-select select-left width-card-lg"
                  name="associatedJudge"
                  value={judgeActivityReport.judgeName}
                  onChange={e =>
                    setJudgeActivityReportFiltersSequence({
                      judgeName: e.target.value,
                    })
                  }
                >
                  <option key="all" value="All Judges">
                    All Judges
                  </option>
                  {(judgeActivityReportJudges || []).map(judge => (
                    <option key={judge.name} value={judge.name}>
                      {judge.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid-col-auto flex-align-center margin-top-2pt4rem margin-left-2">
                <Button
                  className="position-relative margin-bottom-35"
                  disabled={judgeActivityReportHelper.isFormPristine}
                  onClick={() => {
                    submitJudgeActivityReportSequence({
                      selectedPage: 0,
                    });
                    setActivePage(0);
                  }}
                >
                  Run Report
                </Button>
              </div>
            </div>
          </div>

          {judgeActivityReportHelper.showSelectDateRangeText ? (
            <div className="text-semibold margin-0">
              Enter a date range to view activity
            </div>
          ) : judgeActivityReportHelper.showResultsTables ? (
            <>
              <div className="grid-row grid-gap">
                <div className="grid-col-6">
                  <ClosedCases />
                </div>
                <div className="grid-col-6">
                  <TrialSessionsHeld />
                </div>
              </div>

              <div className="grid-row grid-gap">
                <div className="grid-col-6">
                  <OrdersIssued />
                </div>
                <div className="grid-col-6">
                  <OpinionsIssued />
                </div>
              </div>

              <div className="grid-row grid-gap">
                <div className="grid-col-12">
                  <SubmittedCavCasesTable />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-semibold margin-bottom-30px">
                There is no activity for the selected dates
              </div>
              <div className="grid-row grid-gap">
                <div className="grid-col-12">
                  <SubmittedCavCasesTable />
                </div>
              </div>
            </>
          )}
        </section>
      </>
    );
  },
);
