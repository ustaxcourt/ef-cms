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
        {formattedCaseDetail.correspondence.length === 0 && (
          <p>There are no correspondence files.</p>
        )}
        {formattedCaseDetail.correspondence.length > 0 && (
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
              {formattedCaseDetail.correspondence.map(
                (document, arrayIndex) => {
                  return (
                    <tr key={arrayIndex}>
                      <td>
                        <span className="no-wrap">{document.filingDate}</span>
                      </td>
                      <td>
                        <Button link className="padding-0">
                          {document.documentTitle}
                        </Button>
                      </td>
                      <td>{document.filedBy}</td>
                      <td>
                        <Button
                          link
                          className="text-left padding-0 margin-left-1"
                          href={`/case-detail/${formattedCaseDetail.docketNumber}/edit-correspondence/${document.documentId}`}
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
                            openConfirmDeleteCorrespondenceModalSequence(
                              document.documentId,
                            );
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        )}

        {showModal === 'DeleteCorrespondenceModal' && (
          <DeleteCorrespondenceModal />
        )}
      </>
    );
  },
);
