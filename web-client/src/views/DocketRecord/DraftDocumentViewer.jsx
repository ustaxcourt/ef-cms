import { Button } from '../../ustc-ui/Button/Button';
import { DraftDocumentViewerDocument } from './DraftDocumentViewerDocument';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';
import classNames from 'classnames';

export const DraftDocumentViewer = connect(
  {
    draftDocumentId: state.screenMetadata.draftDocumentId,
    formattedCaseDetail: state.formattedCaseDetail,
    loadDefaultDraftViewerDocumentToDisplaySequence:
      sequences.loadDefaultDraftViewerDocumentToDisplaySequence,
    setViewerDraftDocumentToDisplaySequence:
      sequences.setViewerDraftDocumentToDisplaySequence,
    viewerDraftDocumentIdToDisplay:
      state.viewerDraftDocumentToDisplay.documentId,
  },
  function DraftDocumentViewer({
    draftDocumentId,
    formattedCaseDetail,
    loadDefaultDraftViewerDocumentToDisplaySequence,
    setViewerDraftDocumentToDisplaySequence,
    viewerDraftDocumentIdToDisplay,
  }) {
    useEffect(() => {
      loadDefaultDraftViewerDocumentToDisplaySequence({
        documentId: draftDocumentId,
      });
      return;
    }, []);

    return (
      <>
        <div className="grid-row grid-gap-5">
          <div className="grid-col-4">
            <div className="border border-base-lighter document-viewer--documents">
              <div className="grid-row padding-left-205 grid-header">
                <div className="grid-col-3">Created</div>
                <div className="grid-col-9">Document</div>
              </div>
              {formattedCaseDetail.formattedDraftDocuments.map(
                (draftDocument, index) => {
                  return (
                    <Button
                      className={classNames(
                        'usa-button--unstyled attachment-viewer-button',
                        viewerDraftDocumentIdToDisplay ===
                          draftDocument.documentId && 'active',
                      )}
                      isActive={
                        viewerDraftDocumentIdToDisplay ===
                        draftDocument.documentId
                      }
                      key={index}
                      onClick={() => {
                        setViewerDraftDocumentToDisplaySequence({
                          viewerDraftDocumentToDisplay: draftDocument,
                        });
                      }}
                    >
                      <div className="grid-row margin-left-205">
                        <div className="grid-col-3">
                          {draftDocument.createdAtFormatted}
                        </div>
                        <div className="grid-col-9">
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
