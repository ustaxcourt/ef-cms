import { DocumentViewerDocument } from './DocumentViewerDocument';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocumentViewer = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    setViewerDocumentToDisplaySequence:
      sequences.setViewerDocumentToDisplaySequence,
    viewerDocumentToDisplay: state.viewerDocumentToDisplay,
  },
  function DocketRecord({
    formattedCaseDetail,
    setViewerDocumentToDisplaySequence,
    viewerDocumentToDisplay,
  }) {
    return (
      <>
        <div className="grid-row grid-gap-5">
          <div className="grid-col-4">
            <div className="document-viewer--documents">
              <table className="document-viewer usa-table case-detail docket-record responsive-table row-border-only">
                <tbody>
                  {formattedCaseDetail.docketRecordWithDocument.map(
                    ({ document, index, record }, idx) => {
                      if (document) {
                        const active =
                          viewerDocumentToDisplay.documentId ===
                          document.documentId
                            ? 'active'
                            : '';

                        return (
                          <tr
                            className={active}
                            key={idx}
                            onClick={() => {
                              setViewerDocumentToDisplaySequence({
                                viewerDocumentToDisplay: document,
                              });
                            }}
                          >
                            <td className="center-column small">{index}</td>
                            <td>{record.createdAtFormatted}</td>
                            <td>{record.description}</td>
                          </tr>
                        );
                      }
                    },
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid-col-8">
            <DocumentViewerDocument />
          </div>
        </div>
      </>
    );
  },
);
