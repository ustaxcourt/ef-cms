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
    formattedCaseDetail: state.formattedCaseDetail,
    showModal: state.showModal,
  },
  ({ archiveDraftDocumentModalSequence, formattedCaseDetail, showModal }) => {
    return (
      <React.Fragment>
        {formattedCaseDetail.draftDocuments.length === 0 && (
          <p className="heading-3 margin-bottom-10">
            There are no draft documents.
          </p>
        )}
        {formattedCaseDetail.draftDocuments.length > 0 && (
          <table
            aria-label="draft documents"
            className="usa-table case-detail draft-documents responsive-table row-border-only"
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Filings and proceedings</th>
                <th>Created By</th>
                <th>&nbsp;</th>
                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              {formattedCaseDetail.draftDocuments.map(
                (draftDocument, index) => {
                  return (
                    <tr key={index}>
                      <td>{draftDocument.createdAtFormatted}</td>
                      <td>
                        <FilingsAndProceedings
                          arrayIndex={index}
                          document={draftDocument}
                          record={{}} // TODO: we are not yet sure where this comes from since we don't have a docket record for proposed / signed stipulated decisions
                        />
                      </td>
                      <td>{draftDocument.filedBy}</td>
                      <td className="no-wrap text-align-right">
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
                              caseId: formattedCaseDetail.caseId,
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
        )}
        {showModal === 'ArchiveDraftDocumentModal' && (
          <ArchiveDraftDocumentModal />
        )}
      </React.Fragment>
    );
  },
);
