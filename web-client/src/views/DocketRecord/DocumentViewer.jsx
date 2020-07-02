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
                  {formattedCaseDetail.formattedDocketEntries.map(
                    (entry, idx) => {
                      const active =
                        viewerDocumentToDisplay.documentId === entry.documentId
                          ? 'active'
                          : '';
                      if (entry.hasDocument) {
                        return (
                          <tr
                            className={active}
                            key={idx}
                            onClick={() => {
                              setViewerDocumentToDisplaySequence({
                                viewerDocumentToDisplay: entry,
                              });
                            }}
                          >
                            <td className="center-column small">
                              {entry.index}
                            </td>
                            <td>{entry.createdAtFormatted}</td>
                            <td>{entry.descriptionDisplay}</td>
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
