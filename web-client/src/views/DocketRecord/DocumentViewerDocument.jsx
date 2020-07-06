import { Button } from '../../ustc-ui/Button/Button';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const DocumentViewerDocument = connect(
  {
    caseDetail: state.caseDetail,
    documentViewerHelper: state.documentViewerHelper,
    iframeSrc: state.iframeSrc,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    viewerDocumentToDisplay: state.viewerDocumentToDisplay,
  },
  function DocumentViewerDocument({
    caseDetail,
    documentViewerHelper,
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
            {documentViewerHelper.showSealedInBlackstone && (
              <div className="sealed-in-blackstone margin-bottom-1">
                <Icon
                  aria-label="sealed case"
                  className="margin-right-1 icon-sealed"
                  icon="lock"
                  size="1x"
                />
                Sealed in Blackstone
              </div>
            )}

            <h3>{documentViewerHelper.description}</h3>

            <div className="grid-row margin-bottom-1">
              <div className="grid-col-6">
                {documentViewerHelper.filedLabel}
              </div>
              <div className="grid-col-6 text-align-right">
                {documentViewerHelper.servedLabel &&
                  documentViewerHelper.servedLabel}
              </div>
            </div>

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
            <iframe src={iframeSrc} title={documentViewerHelper.description} />
          </>
        )}
      </div>
    );
  },
);
