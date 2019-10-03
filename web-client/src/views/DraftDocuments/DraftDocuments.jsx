import { ArchiveDraftDocumentModal } from './ArchiveDraftDocumentModal';
import { Button } from '../../ustc-ui/Button/Button';
import { FilingsAndProceedings } from '../DocketRecord/FilingsAndProceedings';
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
      <>
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
                <th>Created by</th>
                <th>Signature Added</th>
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

                      <td className="no-wrap">
                        {draftDocument.signedAt &&
                          draftDocument.signedAtFormatted}
                        {!draftDocument.signedAt && (
                          <a href={draftDocument.signUrl}>Add Signature</a>
                        )}
                      </td>

                      <td className="no-wrap text-align-right">
                        <Button link href={draftDocument.editUrl} icon="edit">
                          Edit
                        </Button>
                      </td>

                      <td className="smaller-column">
                        <Button
                          link
                          className="red-warning"
                          icon="times-circle"
                          onClick={() => {
                            archiveDraftDocumentModalSequence({
                              caseId: formattedCaseDetail.caseId,
                              documentId: draftDocument.documentId,
                              documentTitle: draftDocument.documentTitle,
                            });
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
        {showModal === 'ArchiveDraftDocumentModal' && (
          <ArchiveDraftDocumentModal />
        )}
      </>
    );
  },
);
