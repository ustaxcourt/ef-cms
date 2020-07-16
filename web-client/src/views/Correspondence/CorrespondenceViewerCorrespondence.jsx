import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const CorrespondenceViewerCorrespondence = connect(
  {
    caseDetail: state.caseDetail,
    correspondenceViewerHelper: state.correspondenceViewerHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    iframeSrc: state.iframeSrc,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    openConfirmDeleteCorrespondenceModalSequence:
      sequences.openConfirmDeleteCorrespondenceModalSequence,
    viewerCorrespondenceToDisplay: state.viewerCorrespondenceToDisplay,
  },
  function CorrespondenceViewerCorrespondence({
    caseDetail,
    correspondenceViewerHelper,
    formattedCaseDetail,
    iframeSrc,
    openCaseDocumentDownloadUrlSequence,
    openConfirmDeleteCorrespondenceModalSequence,
    viewerCorrespondenceToDisplay,
  }) {
    return (
      <div
        className={classNames(
          'document-viewer--documents',
          !viewerCorrespondenceToDisplay && 'border border-base-lighter',
        )}
      >
        {!viewerCorrespondenceToDisplay && (
          <div className="padding-2">
            There is no document selected for preview
          </div>
        )}

        {viewerCorrespondenceToDisplay && (
          <>
            <h3 className="margin-bottom-1">
              {viewerCorrespondenceToDisplay.documentTitle}
            </h3>

            <div className="grid-row margin-bottom-1">
              Created by {viewerCorrespondenceToDisplay.filedBy}
            </div>

            <div className="message-document-actions">
              {correspondenceViewerHelper.showEditCorrespondenceButton && (
                <Button
                  link
                  className="edit-correspondence-button"
                  href={`/case-detail/${formattedCaseDetail.docketNumber}/edit-correspondence/${viewerCorrespondenceToDisplay.documentId}`}
                  icon="edit"
                  iconColor="white"
                >
                  Edit
                </Button>
              )}

              {correspondenceViewerHelper.showDeleteCorrespondenceButton && (
                <Button
                  link
                  icon="trash"
                  iconColor="white"
                  onClick={() => {
                    openConfirmDeleteCorrespondenceModalSequence({
                      documentId: viewerCorrespondenceToDisplay.documentId,
                      documentTitle:
                        viewerCorrespondenceToDisplay.documentTitle,
                    });
                  }}
                >
                  Delete
                </Button>
              )}

              <Button
                link
                icon="file-pdf"
                iconColor="white"
                onClick={() =>
                  openCaseDocumentDownloadUrlSequence({
                    caseId: caseDetail.caseId,
                    documentId: viewerCorrespondenceToDisplay.documentId,
                  })
                }
              >
                View Full PDF
              </Button>
            </div>

            {!process.env.CI && (
              <iframe
                src={iframeSrc}
                title={viewerCorrespondenceToDisplay.documentTitle}
              />
            )}
          </>
        )}
      </div>
    );
  },
);
