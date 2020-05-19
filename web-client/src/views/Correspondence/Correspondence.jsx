import { Button } from '../../ustc-ui/Button/Button';
import { CorrespondenceHeader } from './CorrespondenceHeader';
import { DeleteCorrespondenceModal } from './DeleteCorrespondenceModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const Correspondence = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    openConfirmDeleteCorrespondenceModalSequence:
      sequences.openConfirmDeleteCorrespondenceModalSequence,
    showModal: state.modal.showModal,
  },
  function Correspondence({
    formattedCaseDetail,
    openConfirmDeleteCorrespondenceModalSequence,
    showModal,
  }) {
    return (
      <>
        <CorrespondenceHeader />
        <table
          aria-label="docket record"
          className="usa-table case-detail docket-record responsive-table row-border-only"
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Correspondence Description</th>
              <th>Created By</th>
              <th aria-hidden="true" className="icon-column" />
              <th aria-hidden="true" className="icon-column" />
            </tr>
          </thead>
          <tbody>
            {formattedCaseDetail.formattedDocketEntries.map(entry => {
              return (
                <tr
                  className={classNames(
                    entry.showInProgress && 'in-progress',
                    entry.showQcUntouched && 'qc-untouched',
                  )}
                  key={entry.index}
                >
                  <td>
                    <span className="no-wrap">{entry.createdAtFormatted}</span>
                  </td>
                  <td className="center-column hide-on-mobile">
                    {entry.eventCode}
                  </td>
                  <td className="hide-on-mobile">{entry.filedBy}</td>

                  <td>
                    <Button
                      link
                      className="text-left padding-0 margin-left-1"
                      // href={`/case-detail/${formattedCaseDetail.docketNumber}/docket-entry/${entry.index}/edit-meta`}
                      icon="edit"
                    >
                      Edit
                    </Button>
                  </td>
                  <td>
                    <Button
                      link
                      className="red-warning padding-0 text-left margin-left-1"
                      icon="trash"
                      onClick={() => {
                        openConfirmDeleteCorrespondenceModalSequence();
                      }}
                    >
                      Delete
                    </Button>
                    {/* )} */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {showModal === 'DeleteCorrespondenceModal' && (
          <DeleteCorrespondenceModal />
        )}
      </>
    );
  },
);
