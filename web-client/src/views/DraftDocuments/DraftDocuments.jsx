import { ArchiveDraftDocumentModal } from './ArchiveDraftDocumentModal';
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
              <th>&nbsp;</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {caseDetail.draftDocuments.map((draftDocument, index) => {
              return (
                <tr key={index}>
                  <td>{draftDocument.createdAtFormatted}</td>
                  <td>
                    {/* <FilingsAndProceedings
                        arrayIndex={index}
                        document={draftDocument}
                        record={record}
                      /> */}
                    {/* {FilingsAndProceedings} */}
                    {draftDocument.documentType}
                  </td>
                  <td>{draftDocument.filedBy}</td>
                  <td className="no-wrap text-align-right">
                    {/* TODO: Link to the document to edit */}
                    <a
                      className="usa-button usa-button--unstyled"
                      href={draftDocument.editUrl}
                    >
                      <FontAwesomeIcon icon="edit" size="sm" />
                      Edit
                    </a>
                  </td>

                  <td className="smaller-column">
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
            })}
          </tbody>
        </table>
        {showModal === 'ArchiveDraftDocumentModal' && (
          <ArchiveDraftDocumentModal />
        )}
      </React.Fragment>
    );
  },
);
