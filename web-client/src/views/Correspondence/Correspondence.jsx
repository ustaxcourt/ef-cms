import { Button } from '../../ustc-ui/Button/Button';
import { CorrespondenceHeader } from './CorrespondenceHeader';
import { DeleteCorrespondenceModal } from './DeleteCorrespondenceModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const Correspondence = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    openConfirmDeleteCorrespondenceModalSequence:
      sequences.openConfirmDeleteCorrespondenceModalSequence,
    showAddCorrespondenceButton:
      state.caseDetailHelper.showAddCorrespondenceButton,
    showModal: state.modal.showModal,
  },
  function Correspondence({
    formattedCaseDetail,
    openCaseDocumentDownloadUrlSequence,
    openConfirmDeleteCorrespondenceModalSequence,
    showAddCorrespondenceButton,
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
            aria-label="correspondence"
            className="usa-table case-detail responsive-table row-border-only"
            id="correspondence-documents-table"
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
              {formattedCaseDetail.correspondence.map((document, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <span className="no-wrap">
                        {document.formattedFilingDate}
                      </span>
                    </td>
                    <td>
                      <Button
                        link
                        className="padding-0"
                        rel="noopener noreferrer"
                        onClick={() =>
                          openCaseDocumentDownloadUrlSequence({
                            caseId: formattedCaseDetail.caseId,
                            documentId: document.documentId,
                          })
                        }
                      >
                        {document.documentTitle}
                      </Button>
                    </td>
                    <td>{document.filedBy}</td>
                    <td>
                      {showAddCorrespondenceButton && (
                        <Button
                          link
                          className="edit-correspondence-button text-left padding-0 margin-left-1"
                          href={`/case-detail/${formattedCaseDetail.docketNumber}/edit-correspondence/${document.documentId}`}
                          icon="edit"
                        >
                          Edit
                        </Button>
                      )}
                    </td>
                    <td>
                      {showAddCorrespondenceButton && (
                        <Button
                          link
                          className="delete-correspondence-button red-warning padding-0 text-left margin-left-1"
                          icon="trash"
                          onClick={() => {
                            openConfirmDeleteCorrespondenceModalSequence({
                              documentId: document.documentId,
                              documentTitle: document.documentTitle,
                            });
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
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
