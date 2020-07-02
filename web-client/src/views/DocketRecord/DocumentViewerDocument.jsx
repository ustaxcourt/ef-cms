import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const DocumentViewerDocument = connect(
  {
    caseDetail: state.caseDetail,
    iframeSrc: state.iframeSrc,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    viewerDocumentToDisplay: state.viewerDocumentToDisplay,
  },
  function DocumentViewerDocument({
    caseDetail,
    iframeSrc,
    openCaseDocumentDownloadUrlSequence,
    viewerDocumentToDisplay,
  }) {
    return (
      <div
        className={classNames(
          'document-viewer--documents',
          !viewerDocumentToDisplay && 'border border-base-lighter',
        )}
      >
        {!viewerDocumentToDisplay && (
          <div className="padding-2">
            There is no document selected for preview
          </div>
        )}

        {!process.env.CI && viewerDocumentToDisplay && (
          <>
            <div className="message-document-actions">
              <Button
                link
                icon="file-pdf"
                iconColor="white"
                onClick={() =>
                  openCaseDocumentDownloadUrlSequence({
                    caseId: caseDetail.caseId,
                    documentId: viewerDocumentToDisplay.documentId,
                  })
                }
              >
                View Full PDF
              </Button>
            </div>
            <iframe
              src={iframeSrc}
              title={
                viewerDocumentToDisplay.documentTitle ||
                (viewerDocumentToDisplay.descriptionDisplay &&
                  viewerDocumentToDisplay.descriptionDisplay)
              }
            />
          </>
        )}
      </div>
    );
  },
);
