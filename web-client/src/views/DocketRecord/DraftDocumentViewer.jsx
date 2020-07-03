import { Button } from '../../ustc-ui/Button/Button';
import { DraftDocumentViewerDocument } from './DraftDocumentViewerDocument';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DraftDocumentViewer = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    setViewerDraftDocumentToDisplaySequence:
      sequences.setViewerDraftDocumentToDisplaySequence,
    viewerDraftDocumentToDisplay: state.viewerDraftDocumentToDisplay,
  },
  function DraftDocumentViewer({
    formattedCaseDetail,
    setViewerDraftDocumentToDisplaySequence,
    viewerDraftDocumentToDisplay,
  }) {
    return (
      <>
        <div className="grid-row grid-gap-5">
          <div className="grid-col-4">
            <div className="border border-base-lighter document-viewer--documents">
              {formattedCaseDetail.formattedDraftDocuments.map(
                (draftDocument, index) => {
                  const active =
                    viewerDraftDocumentToDisplay?.documentId ===
                    draftDocument.documentId
                      ? 'active'
                      : '';

                  return (
                    <Button
                      className={`usa-button--unstyled attachment-viewer-button ${active}`}
                      key={index}
                      onClick={() => {
                        setViewerDraftDocumentToDisplaySequence({
                          viewerDraftDocumentToDisplay: draftDocument,
                        });
                      }}
                    >
                      <div className="grid-row">
                        <div className="grid-col-3">
                          {draftDocument.createdAtFormatted}
                        </div>
                        <div className="grid-col-9 no-indent">
                          {draftDocument.descriptionDisplay}
                        </div>
                      </div>
                    </Button>
                  );
                },
              )}
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
