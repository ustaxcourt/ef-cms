import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { FilingsAndProceedings } from '../DocketRecord/FilingsAndProceedings';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PendingReportList = connect(
  {
    formattedPendingItems: state.formattedPendingItems,
  },
  ({ formattedPendingItems }) => {
    return (
      <React.Fragment>
        <div className="ustc-table--filters">
          <BindedSelect
            ariaLabel="judge"
            bind="screenMetadata.pendingItemsFilters.judge"
            className="select-right"
            id="judgeFilter"
            name="judge"
          >
            <option value="">Filter by Judge</option>
            {formattedPendingItems.judges.map((judge, idx) => (
              <option key={idx} value={judge}>
                {judge}
              </option>
            ))}
          </BindedSelect>
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
                <td>{item.caseCaptionNames}</td>
                <td>
                  {/* <FilingsAndProceedings
                    arrayIndex={idx}
                    document={document}
                    record={item}
                  /> */}
                </td>
                <td>{item.status}</td>
                <td>{item.associatedJudgeFormatted}</td>
              </tr>
            </tbody>
          ))}
        </table>
        {formattedPendingItems.length === 0 && <p>There is nothing pending.</p>}
      </React.Fragment>
    );
  },
);
