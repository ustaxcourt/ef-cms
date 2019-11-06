import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PendingReportList = connect(
  {
    pendingItemsFormatted: state.pendingItems,
    users: state.users,
  },
  ({ pendingItemsFormatted, users }) => {
    return (
      <React.Fragment>
        <div className="grid-row margin-bottom-3">
          <div className="tablet:grid-col-7">
            <div className="grid-row grid-gap">
              <div className="grid-col-3">
                <BindedSelect
                  ariaLabel="judge"
                  bind="screenMetadata.pendingItemsFilters.judge.userId"
                  id="judgeFilter"
                  name="judge"
                >
                  <option value="">Filter by Judge</option>
                  {users.map((judge, idx) => (
                    <option key={idx} value={judge.userId}>
                      {judge.name}
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
              <th>Docket</th>
              <th>Date Filed</th>
              <th>Case Name</th>
              <th>Filings &amp; proceedings</th>
              <th>Case Status</th>
              <th>Judge (sortable)</th>
            </tr>
          </thead>
          {pendingItemsFormatted.map((item, idx) => (
            <tbody key={idx}>
              <tr className="pending-item-row">
                <td>{item.docketNumber}</td>
                <td>{item.formattedDate}</td>
                <td>{item.caseName}</td>
                <td>
                  <a href="/#">{item.filingsAndProceedings}</a>
                </td>
                <td>{item.caseStatus}</td>
                <td>{item.judge && item.judge.name}</td>
              </tr>
            </tbody>
          ))}
        </table>
        {pendingItemsFormatted.length === 0 && <p>There is nothing pending.</p>}
      </React.Fragment>
    );
  },
);
