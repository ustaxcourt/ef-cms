import { Button } from '../../ustc-ui/Button/Button';
import { ConfirmRemoveCaseDetailPendingItemModal } from './ConfirmRemoveCaseDetailPendingItemModal';
import { FilingsAndProceedings } from '../DocketRecord/FilingsAndProceedings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CaseDetailPendingReportList = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    openConfirmRemoveCaseDetailPendingItemModalSequence:
      sequences.openConfirmRemoveCaseDetailPendingItemModalSequence,
    pendingItemsDocketEntries:
      state.formattedCaseDetail.pendingItemsDocketEntries,
    showModal: state.showModal,
  },
  ({
    formattedCaseDetail,
    openConfirmRemoveCaseDetailPendingItemModalSequence,
    pendingItemsDocketEntries,
    showModal,
  }) => {
    return (
      <>
        <div>
          <Button
            link
            className="push-right margin-top-2"
            href={`/case-detail/${formattedCaseDetail.docketNumber}/pending-report`}
            icon="print"
          >
            Print Report
          </Button>
        </div>
        <table
          aria-describedby="judgeFilter"
          aria-label="pending items"
          className="usa-table ustc-table pending-items subsection"
          id="pending-items"
        >
          <thead>
            <tr>
              <th>No.</th>
              <th>Date filed</th>
              <th>Filings and proceedings</th>
              <th>Filed by</th>
              <th>Remove</th>
            </tr>
          </thead>
          {pendingItemsDocketEntries.map(
            ({ document, record, showRemoveButton }, arrayIndex) => (
              <tbody key={arrayIndex}>
                <tr className="pending-item-row">
                  <td>{arrayIndex + 1}</td>
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
                    {showRemoveButton && (
                      <Button
                        link
                        className="padding-0"
                        onClick={() =>
                          openConfirmRemoveCaseDetailPendingItemModalSequence({
                            documentId: document.documentId,
                          })
                        }
                      >
                        <FontAwesomeIcon icon={['fas', 'trash']} />
                        Remove
                      </Button>
                    )}
                  </td>
                </tr>
              </tbody>
            ),
          )}
        </table>
        {pendingItemsDocketEntries.length === 0 && (
          <p>There is nothing pending.</p>
        )}
        {showModal === 'ConfirmRemoveCaseDetailPendingItemModal' && (
          <ConfirmRemoveCaseDetailPendingItemModal />
        )}
      </>
    );
  },
);
