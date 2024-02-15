import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const CaseInventoryReport = connect(
  {
    caseInventoryReportHelper: state.caseInventoryReportHelper,
    caseInventoryReportLoadMoreSequence:
      sequences.caseInventoryReportLoadMoreSequence,
    getCaseInventoryReportSequence: sequences.getCaseInventoryReportSequence,
    gotoPrintableCaseInventoryReportSequence:
      sequences.gotoPrintableCaseInventoryReportSequence,
    screenMetadata: state.screenMetadata,
  },
  function CaseInventoryReport({
    caseInventoryReportHelper,
    caseInventoryReportLoadMoreSequence,
    getCaseInventoryReportSequence,
    gotoPrintableCaseInventoryReportSequence,
    screenMetadata,
  }) {
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

          <div className="padding-top-3 padding-bottom-1">
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
              onChange={e =>
                getCaseInventoryReportSequence({
                  key: e.target.name,
                  value: e.target.value,
                })
              }
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
              onChange={e =>
                getCaseInventoryReportSequence({
                  key: e.target.name,
                  value: e.target.value,
                })
              }
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
          </div>

          {caseInventoryReportHelper.showResultsTable && (
            <>
              <div className="grid-row grid-gap margin-top-1">
                <div className="grid-col-12 text-align-right">
                  <span className="text-semibold">Count:</span>{' '}
                  {caseInventoryReportHelper.resultCount}
                </div>
              </div>

              <div className="grid-row grid-gap margin-top-1">
                <div className="grid-col-12">
                  <table className="usa-table row-border-only subsection case-inventory">
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
                        <th aria-label="docket number">Docket No.</th>
                        <th>Case Title</th>
                        {caseInventoryReportHelper.showJudgeColumn && (
                          <th>Judge</th>
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
                            <td>
                              <CaseLink formattedCase={row} />
                            </td>
                            <td>{row.caseTitle}</td>
                            {caseInventoryReportHelper.showJudgeColumn && (
                              <td>{row.associatedJudge}</td>
                            )}
                            {caseInventoryReportHelper.showStatusColumn && (
                              <td>{row.status}</td>
                            )}
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                  {caseInventoryReportHelper.showLoadMoreButton && (
                    <Button
                      onClick={() => caseInventoryReportLoadMoreSequence()}
                    >
                      Load More
                    </Button>
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
