import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const PendingReportList = connect(
  {
    formattedPendingItems: state.formattedPendingItems,
    sort: state.screenMetadata.sort,
    sortOrder: state.screenMetadata.sortOrder,
    togglePendingReportSortSequence: sequences.togglePendingReportSortSequence,
  },
  ({
    formattedPendingItems,
    sort,
    sortOrder,
    togglePendingReportSortSequence,
  }) => {
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
              <th>
                <Button
                  link
                  className="sortable-header-button"
                  onClick={() => {
                    togglePendingReportSortSequence({
                      sort: 'date',
                      sortOrder: 'asc',
                    });
                  }}
                >
                  <span
                    className={classNames(
                      'margin-right-105',
                      sort === 'date' && 'sortActive',
                    )}
                  >
                    Date Filed
                  </span>
                  {sort === 'date' &&
                    (sortOrder === 'desc' ? (
                      <FontAwesomeIcon icon="caret-up" />
                    ) : (
                      <FontAwesomeIcon icon="caret-down" />
                    ))}
                </Button>
              </th>
              <th>Case Name</th>
              <th>Filings &amp; proceedings</th>
              <th>Case Status</th>
              <th>
                <Button
                  link
                  className="sortable-header-button"
                  onClick={() => {
                    togglePendingReportSortSequence({
                      sort: 'judge',
                      sortOrder: 'asc',
                    });
                  }}
                >
                  <span
                    className={classNames(
                      'margin-right-105',
                      sort === 'judge' && 'sortActive',
                    )}
                  >
                    Judge
                  </span>
                  {sort === 'judge' &&
                    (sortOrder === 'desc' ? (
                      <FontAwesomeIcon icon="caret-up" />
                    ) : (
                      <FontAwesomeIcon icon="caret-down" />
                    ))}
                </Button>
              </th>
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
        {formattedPendingItems.length === 0 && <p>There is nothing pending.</p>}
      </React.Fragment>
    );
  },
);
