import { DocumentViewerDocument } from './DocumentViewerDocument';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

export const DocumentViewer = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    loadDefaultDocketViewerDocumentToDisplaySequence:
      sequences.loadDefaultDocketViewerDocumentToDisplaySequence,
    setViewerDocumentToDisplaySequence:
      sequences.setViewerDocumentToDisplaySequence,
    viewDocumentId: state.viewerDocumentToDisplay.documentId,
  },
  function DocumentViewer({
    formattedCaseDetail,
    loadDefaultDocketViewerDocumentToDisplaySequence,
    setViewerDocumentToDisplaySequence,
    viewDocumentId,
  }) {
    useEffect(() => {
      loadDefaultDocketViewerDocumentToDisplaySequence();
      return;
    }, []);

    return (
      <>
        <div className="grid-row grid-gap-5">
          <div className="grid-col-4">
            <div className="document-viewer--documents">
              <table className="document-viewer usa-table case-detail docket-record responsive-table row-border-only">
                <thead>
                  <tr>
                    <th>Index</th>
                    <th>Filed</th>
                    <th>Filings and proceedings</th>
                    <th>&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedCaseDetail.formattedDocketEntries.map(
                    (entry, idx) => {
                      // TODO: should live in a computed
                      if (entry.isFileAttached) {
                        const active =
                          viewDocumentId === entry.documentId ? 'active' : '';

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
                            <td>{entry.description}</td>
                            <td>
                              {entry.showNotServed && (
                                <span className="text-semibold not-served">
                                  Not served
                                </span>
                              )}
                            </td>
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
