import { Button } from '../../ustc-ui/Button/Button';
import { ConfirmRemoveCaseDetailPendingItemModal } from './ConfirmRemoveCaseDetailPendingItemModal';
import { FilingsAndProceedings } from '../DocketRecord/FilingsAndProceedings';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const CaseDetailPendingReportList = connect(
  {
    caseDetailHelper: state.caseDetailHelper,
    formattedDocketEntries: state.formattedDocketEntries,
    openConfirmRemoveCaseDetailPendingItemModalSequence:
      sequences.openConfirmRemoveCaseDetailPendingItemModalSequence,
    showModal: state.modal.showModal,
  },
  function CaseDetailPendingReportList({
    caseDetailHelper,
    formattedDocketEntries,
    openConfirmRemoveCaseDetailPendingItemModalSequence,
    showModal,
  }) {
    return (
      <>
        <div className="margin-top-3 margin-bottom-105 text-right">
          <Button
            link
            aria-describedby="tab-pending-report"
            className="margin-right-0"
            href={`/case-detail/${formattedDocketEntries.docketNumber}/pending-report`}
            icon="print"
          >
            Printable Report
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
              <th>
                <span>
                  <span className="usa-sr-only">Number</span>
                  <span aria-hidden="true">No.</span>
                </span>
              </th>
              <th>Filed Date</th>
              <th>Filings and Proceedings</th>
              <th>Filed By</th>
              <th></th>
            </tr>
          </thead>
          {formattedDocketEntries.formattedPendingDocketEntriesOnDocketRecord.map(
            entry => (
              <tbody key={entry.docketEntryId}>
                <tr className="pending-item-row">
                  <td>{entry.index}</td>
                  <td>
                    <span className="no-wrap">{entry.createdAtFormatted}</span>
                  </td>
                  <td>
                    <FilingsAndProceedings entry={entry} />
                  </td>
                  <td>{entry.filedBy}</td>
                  <td>
                    {caseDetailHelper.hasTrackedItemsPermission && (
                      <Button
                        link
                        className="padding-0 no-wrap"
                        icon="trash"
                        onClick={() =>
                          openConfirmRemoveCaseDetailPendingItemModalSequence({
                            docketEntryId: entry.docketEntryId,
                          })
                        }
                      >
                        Remove
                      </Button>
                    )}
                  </td>
                </tr>
              </tbody>
            ),
          )}
        </table>
        {formattedDocketEntries.formattedPendingDocketEntriesOnDocketRecord
          .length === 0 && <p>There is nothing pending.</p>}
        {showModal === 'ConfirmRemoveCaseDetailPendingItemModal' && (
          <ConfirmRemoveCaseDetailPendingItemModal />
        )}
      </>
    );
  },
);

CaseDetailPendingReportList.displayName = 'CaseDetailPendingReportList';
