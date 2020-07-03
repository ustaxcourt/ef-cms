import { Button } from '../../ustc-ui/Button/Button';
import { DocumentViewerDocument } from './DocumentViewerDocument';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const DraftDocumentViewer = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
  },
  function DraftDocumentViewer({ formattedCaseDetail }) {
    return (
      <>
        <div className="grid-row grid-gap-5">
          <div className="grid-col-4">
            <div className="border border-base-lighter document-viewer--documents">
              {formattedCaseDetail.formattedDraftDocuments.map(
                (draftDocument, index) => {
                  return (
                    <Button
                      className={
                        'usa-button--unstyled attachment-viewer-button'
                      }
                      key={index}
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
            <DocumentViewerDocument />
          </div>
        </div>
      </>
    );
  },
);
