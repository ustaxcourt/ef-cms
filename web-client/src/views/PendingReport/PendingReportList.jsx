import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
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
        <div className="grid-row margin-bottom-2">
          <div className="tablet:grid-col-7">
            <div className="grid-row grid-gap">
              <div className="grid-col-3 tablet:grid-col-2 padding-top-05">
                <h3 id="filterHeading">Filter by</h3>
              </div>
              <div className="grid-col-3">
                <BindedSelect
                  ariaLabel="judge"
                  bind="screenMetadata.pendingItemsFilters.judge"
                  className="select-left"
                  id="judgeFilter"
                  name="judge"
                  placeHolder="xyz"
                >
                  <option value="">- judge -</option>
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
              <th>Docket</th>
              <th>Date filed</th>
              <th>Case name</th>
              <th>Filings and proceedings</th>
              <th>Case status</th>
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
                  <a
                    href={`/case-detail/${item.docketNumber}/documents/${item.documentId}`}
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
