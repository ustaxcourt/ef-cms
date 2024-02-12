import { Button } from '../../ustc-ui/Button/Button';
import { DraftDocumentViewerDocument } from './DraftDocumentViewerDocument';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect } from 'react';
import classNames from 'classnames';

export const DraftDocumentViewer = connect(
  {
    formattedDocketEntries: state.formattedDocketEntries,
    loadDefaultDraftViewerDocumentToDisplaySequence:
      sequences.loadDefaultDraftViewerDocumentToDisplaySequence,
    setViewerDraftDocumentToDisplaySequence:
      sequences.setViewerDraftDocumentToDisplaySequence,
    viewerDraftDocumentIdToDisplay:
      state.viewerDraftDocumentToDisplay.docketEntryId,
  },
  function DraftDocumentViewer({
    formattedDocketEntries,
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
            <div className="border border-base-lighter document-viewer--documents document-viewer--documents-list-container">
              <div className="grid-row padding-left-205 grid-header">
                <div className="grid-col-3">Created</div>
                <div className="grid-col-9">Document</div>
              </div>
              <div className="document-viewer--documents-list">
                {formattedDocketEntries.formattedDraftDocuments.map(
                  (draftDocument, idx) => (
                    <Button
                      className={classNames(
                        'usa-button--unstyled attachment-viewer-button',
                        viewerDraftDocumentIdToDisplay ===
                          draftDocument.docketEntryId && 'active',
                      )}
                      isActive={
                        viewerDraftDocumentIdToDisplay ===
                        draftDocument.docketEntryId
                      }
                      key={draftDocument.docketEntryId}
                      onClick={() => {
                        setViewerDraftDocumentToDisplaySequence({
                          viewerDraftDocumentToDisplay: draftDocument,
                        });
                      }}
                    >
                      <div className="grid-row margin-left-205">
                        <div
                          className="grid-col-3"
                          id={`docket-entry-createdAt-${idx}`}
                        >
                          {draftDocument.createdAtFormatted}
                        </div>
                        <div
                          className="grid-col-9"
                          data-test-docket-entry-description={
                            draftDocument.descriptionDisplay
                          }
                          data-testid={`docket-entry-description-${idx}`}
                          id={`docket-entry-description-${idx}`}
                        >
                          {draftDocument.descriptionDisplay}
                        </div>
                      </div>
                    </Button>
                  ),
                )}
              </div>
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

DraftDocumentViewer.displayName = 'DraftDocumentViewer';
