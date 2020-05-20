import { Button } from '../../ustc-ui/Button/Button';
import { CorrespondenceHeader } from './CorrespondenceHeader';
import { DeleteCorrespondenceModal } from './DeleteCorrespondenceModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

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
            <tr>
              <td>
                <span className="no-wrap">01/01/2001</span>
              </td>
              <td>
                <Button link className="padding-0">
                  This will be the linked correspondence name
                </Button>
              </td>
              <td>Name of the user who filed this</td>
              <td>
                <Button
                  link
                  className="text-left padding-0 margin-left-1"
                  href={`/case-detail/${formattedCaseDetail.docketNumber}/edit-correspondence/1234`}
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
              </td>
            </tr>
          </tbody>
        </table>

        {showModal === 'DeleteCorrespondenceModal' && (
          <DeleteCorrespondenceModal />
        )}
      </>
    );
  },
);
