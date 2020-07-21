import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PendingReportList = connect(
  {
    formattedPendingItems: state.formattedPendingItems,
  },
  function PendingReportList({ formattedPendingItems }) {
    return (
      <React.Fragment>
        <div className="grid-row margin-bottom-2">
          <div className="tablet:grid-col-7">
            <div className="grid-row grid-gap">
              <div className="grid-col-3 tablet:grid-col-2 padding-top-05">
                <h3 id="filterHeading">Filter by</h3>
              </div>
              <div className="grid-col-3">
                <BindedSelect
                  ariaDescribedBy="pending-report-tab filterHeading"
                  ariaLabel="judge"
                  bind="screenMetadata.pendingItemsFilters.judge"
                  className="select-left"
                  id="judgeFilter"
                  name="judge"
                  placeHolder="xyz"
                >
                  <option value="">-Judge-</option>
                  {formattedPendingItems.judges.map((judge, idx) => (
                    <option key={idx} value={judge}>
                      {judge}
                    </option>
                  ))}
                </BindedSelect>
              </div>
            </div>
          </div>
        </div>

        <table
          aria-describedby="judgeFilter"
          aria-label="pending items"
          className="usa-table ustc-table pending-items subsection"
          id="pending-items"
        >
          <thead>
            <tr>
              <th aria-label="Docket Number">Docket No.</th>
              <th>Date Filed</th>
              <th>Case Title</th>
              <th>Filings and Proceedings</th>
              <th>Case Status</th>
              <th>Judge</th>
            </tr>
          </thead>
          {formattedPendingItems.items.map((item, idx) => (
            <tbody key={idx}>
              <tr className="pending-item-row">
                <td>
                  <CaseLink formattedCase={item} />
                </td>
                <td>{item.formattedFiledDate}</td>
                <td>{item.caseTitle}</td>
                <td>
                  <a
                    href={`/case-detail/${item.docketNumber}/document-view?documentId=${item.documentId}`}
                  >
                    {item.formattedName}
                  </a>
                </td>
                <td>{item.status}</td>
                <td>{item.associatedJudgeFormatted}</td>
              </tr>
            </tbody>
          ))}
        </table>
        {formattedPendingItems.items.length === 0 && (
          <p>There is nothing pending.</p>
        )}
      </React.Fragment>
    );
  },
);
