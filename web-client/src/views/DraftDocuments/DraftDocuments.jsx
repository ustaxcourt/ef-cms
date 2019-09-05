import { ArchiveDraftDocumentModal } from './ArchiveDraftDocumentModal';
import { FilingsAndProceedings } from '../DocketRecord/FilingsAndProceedings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DraftDocuments = connect(
  {
    archiveDraftDocumentModalSequence:
      sequences.archiveDraftDocumentModalSequence,
    caseDetail: state.formattedCaseDetail,
    showModal: state.showModal,
  },
  ({ archiveDraftDocumentModalSequence, caseDetail, showModal }) => {
    return (
      <React.Fragment>
        <table
          aria-label="draft documents"
          className="usa-table case-detail draft-documents responsive-table row-border-only"
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Filings and Proceedings</th>
              <th>Created By</th>
              <th width="50">&nbsp;</th>
              <th width="50">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {/* TODO: Update draftDocuments with whatever it ends up being, and remove existential check */}
            {caseDetail.draftDocuments &&
              caseDetail.draftDocuments.map(
                ({ draftDocument, record }, index) => {
                  return (
                    <tr key={index}>
                      <td>{draftDocument.createdAtFormatted}</td>
                      <td>
                        <FilingsAndProceedings
                          arrayIndex={index}
                          document={draftDocument}
                          record={record}
                        />
                        {FilingsAndProceedings}
                      </td>
                      <td>{record.filedBy}</td>
                      <td className="no-wrap text-align-right">
                        {/* TODO: Link to the document to edit */}
                        <a
                          className="usa-button usa-button--unstyled"
                          href={`/case-detail/${caseDetail.docketNumber}`}
                        >
                          <FontAwesomeIcon icon="edit" size="sm" />
                          Edit
                        </a>
                      </td>
                      <td className="no-wrap text-align-right">
                        <button
                          className="usa-button usa-button--unstyled red-warning"
                          onClick={() => {
                            archiveDraftDocumentModalSequence({
                              caseId: caseDetail.caseId,
                              documentId: draftDocument.documentId,
                              documentTitle: draftDocument.documentTitle,
                            });
                          }}
                        >
                          <FontAwesomeIcon icon="times-circle" size="sm" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                },
              )}
          </tbody>
        </table>
        {showModal === 'ArchiveDraftDocumentModal' && (
          <ArchiveDraftDocumentModal />
        )}
      </React.Fragment>
    );
  },
);
