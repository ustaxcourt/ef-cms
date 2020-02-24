import { BigHeader } from '../BigHeader';
import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseInventoryReport = connect(
  {
    caseInventoryReportHelper: state.caseInventoryReportHelper,
  },
  ({ caseInventoryReportHelper }) => {
    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <div className="title">
            <h1>Case Inventory</h1>

            <Button
              link
              className="float-right"
              icon="print"
              onClick={() => null}
            >
              Printable Report
            </Button>
          </div>

          <div className="grid-row grid-gap padding-top-3 padding-bottom-1">
            <div className="grid-col-2 padding-top-05">
              <h3 id="filterHeading">Filter by</h3>
            </div>
            <div className="grid-col-3">
              <BindedSelect
                ariaDescribedBy="filterHeading"
                ariaLabel="judge"
                bind="screenMetadata.caseInventoryReport.judge"
                className="select-left"
                id="judgeFilter"
                name="judge"
                placeHolder="- Judge -"
              >
                <option value="">-Judge-</option>
                {caseInventoryReportHelper.judges.map((judge, idx) => (
                  <option key={idx} value={judge}>
                    {judge}
                  </option>
                ))}
              </BindedSelect>
            </div>
            <div className="grid-col-3">
              <BindedSelect
                ariaDescribedBy="filterHeading"
                ariaLabel="status"
                bind="screenMetadata.caseInventoryReport.judge"
                className="select-left"
                id="statusFilter"
                name="status"
                placeHolder="- Status -"
              >
                <option value="">-Status-</option>
                {Object.keys(caseInventoryReportHelper.caseStatuses).map(
                  key => {
                    const value = caseInventoryReportHelper.caseStatuses[key];
                    return (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    );
                  },
                )}
              </BindedSelect>
            </div>
          </div>

          <div className="grid-row grid-gap margin-top-1">
            <div className="grid-col-12 text-align-right">
              Count: {caseInventoryReportHelper.resultCount}
            </div>
          </div>

          <div className="grid-row grid-gap margin-top-1">
            <div className="grid-col-12">
              <table className="usa-table row-border-only subsection work-queue deadlines">
                <thead>
                  <tr>
                    <th>Docket</th>
                    <th>Case title</th>
                    <th>Judge</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
        </section>
      </>
    );
  },
);
