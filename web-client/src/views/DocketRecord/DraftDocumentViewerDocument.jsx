import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const DraftDocumentViewerDocument = connect(
  {
    caseDetail: state.caseDetail,
    draftDocumentViewerHelper: state.draftDocumentViewerHelper,
    iframeSrc: state.iframeSrc,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    viewerDraftDocumentToDisplay: state.viewerDraftDocumentToDisplay,
  },
  function DraftDocumentViewerDocument({
    caseDetail,
    draftDocumentViewerHelper,
    iframeSrc,
    openCaseDocumentDownloadUrlSequence,
    viewerDraftDocumentToDisplay,
  }) {
    return (
      <div
        className={classNames(
          'document-viewer--documents',
          !viewerDraftDocumentToDisplay && 'border border-base-lighter',
        )}
      >
        {!viewerDraftDocumentToDisplay && (
          <div className="padding-2">
            There is no document selected for preview
          </div>
        )}

        {!process.env.CI && viewerDraftDocumentToDisplay && (
          <>
            <h3>{draftDocumentViewerHelper.documentTitle}</h3>

            <div className="grid-row margin-bottom-1">
              {draftDocumentViewerHelper.createdByLabel}
            </div>

            <div className="message-document-actions">
              <Button
                link
                icon="file-pdf"
                iconColor="white"
                onClick={() =>
                  openCaseDocumentDownloadUrlSequence({
                    caseId: caseDetail.caseId,
                    documentId: viewerDraftDocumentToDisplay.documentId,
                  })
                }
              >
                View Full PDF
              </Button>
            </div>
            <iframe
              src={iframeSrc}
              title={draftDocumentViewerHelper.documentTitle}
            />
          </>
        )}
      </div>
    );
  },
);
