import { DocumentViewerDocument } from './DocumentViewerDocument';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocumentViewer = connect(
  {
    setViewerDocumentToDisplaySequence:
      sequences.setViewerDocumentToDisplaySequence,
    viewerDocumentToDisplay: state.viewerDocumentToDisplay,
  },
  function DocumentViewer({
    documentsToView,
    draftDocuments = false,
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
                  {draftDocuments &&
                    documentsToView.map((draftDocument, index) => {
                      const active =
                        draftDocument.documentId === draftDocument.documentId
                          ? 'active'
                          : '';

                      return (
                        <tr className={active} key={index}>
                          <td className="center-column small">{index}</td>
                          <td>{draftDocument.createdAtFormatted}</td>
                          <td>{draftDocument.descriptionDisplay}</td>
                        </tr>
                      );
                    })}

                  {!draftDocuments &&
                    documentsToView.map(({ document, index, record }, idx) => {
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
                      } else {
                        <tr>
                          <td>hello</td>{' '}
                        </tr>;
                      }
                    })}
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
