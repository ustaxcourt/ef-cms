import { DraftDocumentViewerDocument } from './DraftDocumentViewerDocument';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

export const DraftDocumentViewer = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    loadDefaultDraftViewerDocumentToDisplaySequence:
      sequences.loadDefaultDraftViewerDocumentToDisplaySequence,
    setViewerDraftDocumentToDisplaySequence:
      sequences.setViewerDraftDocumentToDisplaySequence,
    viewerDraftDocumentIdToDisplay:
      state.viewerDraftDocumentToDisplay.documentId,
  },
  function DraftDocumentViewer({
    formattedCaseDetail,
    loadDefaultDraftViewerDocumentToDisplaySequence,
    setViewerDraftDocumentToDisplaySequence,
    viewerDraftDocumentIdToDisplay,
  }) {
    useEffect(() => {
      loadDefaultDraftViewerDocumentToDisplaySequence();
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
                    <th>Created</th>
                    <th>Document</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedCaseDetail.formattedDraftDocuments.map(
                    (draftDocument, index) => {
                      const active =
                        viewerDraftDocumentIdToDisplay ===
                        draftDocument.documentId
                          ? 'active'
                          : '';

                      return (
                        <tr
                          className={active}
                          key={index}
                          onClick={() => {
                            setViewerDraftDocumentToDisplaySequence({
                              viewerDraftDocumentToDisplay: draftDocument,
                            });
                          }}
                        >
                          <td>{draftDocument.createdAtFormatted}</td>
                          <td>{draftDocument.descriptionDisplay}</td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid-col-8">
            <DraftDocumentViewerDocument />
          </div>
        </div>
      </>
    );
  },
);
