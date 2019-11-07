import { Button } from '../../ustc-ui/Button/Button';
import { FilingsAndProceedings } from '../DocketRecord/FilingsAndProceedings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PendingReportList = connect(
  {
    pendingItems: state.formattedCaseDetail.pendingItems,
    users: state.users,
  },
  ({ pendingItems }) => {
    return (
      <React.Fragment>
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
              <th>Filings &amp; proceedings</th>
              <th>Filed By</th>
              <th>Remove</th>
            </tr>
          </thead>
          {pendingItems.map(({ document, index, record }, arrayIndex) => (
            <tbody key={arrayIndex}>
              <tr className="pending-item-row">
                <td>{index}</td>
                <td>
                  <span className="no-wrap">{record.createdAtFormatted}</span>
                </td>
                <td>
                  <FilingsAndProceedings
                    arrayIndex={arrayIndex}
                    document={document}
                    record={record}
                  />
                </td>
                <td>{document.filedBy}</td>
                <td>
                  <Button link className="padding-0">
                    <FontAwesomeIcon icon={['fas', 'trash']} />
                    Remove
                  </Button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
        {pendingItems.length === 0 && <p>There is nothing pending.</p>}
      </React.Fragment>
    );
  },
);
