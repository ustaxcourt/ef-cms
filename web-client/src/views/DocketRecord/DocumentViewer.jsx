import { Button } from '../../ustc-ui/Button/Button';
import { DocumentViewerDocument } from './DocumentViewerDocument';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';
import classNames from 'classnames';

export const DocumentViewer = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    loadDefaultDocketViewerDocumentToDisplaySequence:
      sequences.loadDefaultDocketViewerDocumentToDisplaySequence,
    setViewerDocumentToDisplaySequence:
      sequences.setViewerDocumentToDisplaySequence,
    viewDocumentId: state.viewerDocumentToDisplay.documentId,
  },
  function DocumentViewer({
    formattedCaseDetail,
    loadDefaultDocketViewerDocumentToDisplaySequence,
    setViewerDocumentToDisplaySequence,
    viewDocumentId,
  }) {
    useEffect(() => {
      loadDefaultDocketViewerDocumentToDisplaySequence();
      return;
    }, []);

    return (
      <>
        <div className="grid-row grid-gap-5">
          <div className="grid-col-4">
            <div className="border border-base-lighter document-viewer--documents">
              {formattedCaseDetail.docketRecordWithDocument.map(
                ({ document: recordDocument, index, record }, idx) => {
                  if (recordDocument) {
                    return (
                      <Button
                        className={classNames(
                          'usa-button--unstyled attachment-viewer-button',
                          viewDocumentId === recordDocument.documentId &&
                            'active',
                        )}
                        key={idx}
                        onClick={() => {
                          setViewerDocumentToDisplaySequence({
                            viewerDocumentToDisplay: recordDocument,
                          });
                        }}
                      >
                        <div className="grid-row">
                          <div className="grid-col-1">{index}</div>
                          <div className="grid-col-3">
                            {record.createdAtFormatted}
                          </div>
                          <div className="grid-col-8 no-indent">
                            {record.description}
                          </div>
                        </div>
                      </Button>
                    );
                  }
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
