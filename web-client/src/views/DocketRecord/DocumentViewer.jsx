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
              <div className="grid-row padding-left-205 grid-header">
                <div className="grid-col-2 text-align-center">Index</div>
                <div className="grid-col-3">Filed</div>
                <div className="grid-col-5">Filings and proceedings</div>
                <div className="grid-col-2"></div>
              </div>
              {formattedCaseDetail.formattedDocketEntries.map((entry, idx) => {
                // TODO: should live in a computed
                if (entry.isFileAttached) {
                  return (
                    <Button
                      className={classNames(
                        'usa-button--unstyled attachment-viewer-button',
                        viewDocumentId === entry.documentId && 'active',
                      )}
                      isActive={viewDocumentId === entry.documentId}
                      key={idx}
                      onClick={() => {
                        setViewerDocumentToDisplaySequence({
                          viewerDocumentToDisplay: entry,
                        });
                      }}
                    >
                      <div className="grid-row margin-left-205">
                        <div className="grid-col-2 text-align-center">
                          {entry.index}
                        </div>
                        <div className="grid-col-3">
                          {entry.createdAtFormatted}
                        </div>
                        <div className="grid-col-5">{entry.description}</div>
                        <div className="grid-col-2 padding-left-105">
                          {entry.showNotServed && (
                            <span className="text-semibold not-served">
                              Not served
                            </span>
                          )}
                        </div>
                      </div>
                    </Button>
                  );
                }
              })}
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
