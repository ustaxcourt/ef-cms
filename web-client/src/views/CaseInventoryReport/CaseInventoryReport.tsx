import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { connect } from '@web-client/presenter/shared.cerebral';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useRef, useState } from 'react';

export const CaseInventoryReport = connect(
  {
    caseInventoryReportHelper: state.caseInventoryReportHelper,
    foundCasesTotalCount: state.caseInventoryReportData.foundCasesTotalCount,
    getCaseInventoryReportSequence: sequences.getCaseInventoryReportSequence,
    gotoPrintableCaseInventoryReportSequence:
      sequences.gotoPrintableCaseInventoryReportSequence,
    screenMetadata: state.screenMetadata,
  },
  function CaseInventoryReport({
    caseInventoryReportHelper,
    foundCasesTotalCount,
    getCaseInventoryReportSequence,
    gotoPrintableCaseInventoryReportSequence,
    screenMetadata,
  }) {
    const paginatorTop = useRef(null);
    const [activePage, setActivePage] = useState(0);

    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <div className="title">
            <h1>Case Inventory</h1>

            <Button
              link
              className="float-right margin-right-0"
              icon="print"
              onClick={() => gotoPrintableCaseInventoryReportSequence()}
            >
              Printable Report
            </Button>
          </div>

          <div className="padding-top-3 padding-bottom-1 margin-bottom-1">
            <label
              className="dropdown-label-serif margin-right-3"
              htmlFor="inline-select"
              id="case-inventory-filter-label"
            >
              Filter by
            </label>
            <select
              aria-describedby="case-inventory-filter-label"
              aria-label="judge"
              className="usa-select select-left width-card-lg inline-select"
              name="associatedJudge"
              value={screenMetadata.associatedJudge}
              onChange={e => {
                setActivePage(0);
                getCaseInventoryReportSequence({
                  key: e.target.name,
                  selectedPage: 0,
                  value: e.target.value,
                });
              }}
            >
              <option value="">- Judge -</option>
              {caseInventoryReportHelper.judges.map(judge => (
                <option key={judge} value={judge}>
                  {judge}
                </option>
              ))}
            </select>
            <select
              aria-describedby="case-inventory-filter-label"
              aria-label="status"
              className="usa-select select-left width-card-lg inline-select margin-left-1pt5rem"
              name="status"
              value={screenMetadata.status}
              onChange={e => {
                setActivePage(0);
                getCaseInventoryReportSequence({
                  key: e.target.name,
                  selectedPage: 0,
                  value: e.target.value,
                });
              }}
            >
              <option value="">- Status -</option>
              {caseInventoryReportHelper.caseStatuses.map(status => {
                return (
                  <option key={status} value={status}>
                    {status}
                  </option>
                );
              })}
            </select>
            {caseInventoryReportHelper.pageCount <= 1 && (
              <div className="push-right margin-top-3">
                <span className="text-semibold">Count: </span>
                {foundCasesTotalCount}
              </div>
            )}
          </div>

          {caseInventoryReportHelper.showResultsTable && (
            <>
              {caseInventoryReportHelper.pageCount > 1 && (
                <div ref={paginatorTop} className="grid-row">
                  <div className="grid-col-2"></div>
                  <div className="grid-col-8">
                    <Paginator
                      currentPageIndex={activePage}
                      totalPages={caseInventoryReportHelper.pageCount}
                      onPageChange={async pageChange => {
                        setActivePage(pageChange);
                        await getCaseInventoryReportSequence({
                          key: null,
                          selectedPage: pageChange,
                          value: null,
                        });
                        focusPaginatorTop(paginatorTop);
                      }}
                    />
                  </div>
                  <div className="grid-col-2 text-right margin-top-3 padding-0">
                    <span className="text-semibold">Count: </span>
                    {foundCasesTotalCount}
                  </div>
                </div>
              )}

              <div className="grid-row grid-gap margin-top-1"></div>
              <div className="grid-row grid-gap margin-top-1">
                <div className="grid-col-12">
                  <table
                    className="usa-table row-border-only subsection case-inventory"
                    data-testid="case-inventory-report-table"
                  >
                    <thead>
                      <tr>
                        <th
                          aria-label="consolidation icon"
                          className="width-205"
                        >
                          <span className="usa-sr-only">
                            Consolidated Case Indicator
                          </span>
                        </th>
                        <th aria-label="Docket number" className="width-15">
                          Docket No.
                        </th>
                        <th>Case Title</th>
                        {caseInventoryReportHelper.showJudgeColumn && (
                          <th className="width-15">Judge</th>
                        )}
                        {caseInventoryReportHelper.showStatusColumn && (
                          <th>Case Status</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {caseInventoryReportHelper.formattedReportData.map(
                        row => (
                          <tr key={row.docketNumber}>
                            <td className="width-205">
                              <ConsolidatedCaseIcon
                                consolidatedIconTooltipText={
                                  row.consolidatedIconTooltipText
                                }
                                inConsolidatedGroup={row.inConsolidatedGroup}
                                showLeadCaseIcon={row.isLeadCase}
                              />
                            </td>
                            <td className="width-15">
                              <CaseLink formattedCase={row} />
                            </td>
                            <td>{row.caseTitle}</td>
                            {caseInventoryReportHelper.showJudgeColumn && (
                              <td className="width-15">
                                {row.associatedJudge}
                              </td>
                            )}
                            {caseInventoryReportHelper.showStatusColumn && (
                              <td>{row.status}</td>
                            )}
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                  {caseInventoryReportHelper.pageCount > 1 && (
                    <Paginator
                      currentPageIndex={activePage}
                      totalPages={caseInventoryReportHelper.pageCount}
                      onPageChange={async pageChange => {
                        setActivePage(pageChange);
                        await getCaseInventoryReportSequence({
                          key: null,
                          selectedPage: pageChange,
                          value: null,
                        });
                        focusPaginatorTop(paginatorTop);
                      }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
          {caseInventoryReportHelper.showSelectFilterMessage && (
            <p>Select a status or judge to view cases.</p>
          )}
          {caseInventoryReportHelper.showNoResultsMessage && (
            <p>There are no cases matching your selected filters.</p>
          )}
        </section>
      </>
    );
  },
);

CaseInventoryReport.displayName = 'CaseInventoryReport';
