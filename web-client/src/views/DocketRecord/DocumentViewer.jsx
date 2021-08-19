import { Button } from '../../ustc-ui/Button/Button';
import { DocumentViewerDocument } from './DocumentViewerDocument';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';
import classNames from 'classnames';

export const DocumentViewer = connect(
  {
    formattedDocketEntries: state.formattedDocketEntries,
    loadDefaultDocketViewerDocumentToDisplaySequence:
      sequences.loadDefaultDocketViewerDocumentToDisplaySequence,
    setViewerDocumentToDisplaySequence:
      sequences.setViewerDocumentToDisplaySequence,
    viewDocumentId: state.viewerDocumentToDisplay.docketEntryId,
  },
  function DocumentViewer({
    formattedDocketEntries,
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
            <div className="border border-base-lighter document-viewer--documents document-viewer--documents-list-container">
              <div className="grid-row padding-left-205 grid-header">
                <div className="grid-col-2 text-align-center">Index</div>
                <div className="grid-col-3">Filed</div>
                <div className="grid-col-5">Filings and proceedings</div>
                <div className="grid-col-2"></div>
              </div>
              <div className="document-viewer--documents-list">
                {formattedDocketEntries.formattedDocketEntriesOnDocketRecord.map(
                  entry => {
                    // TODO: should live in a computed
                    if (entry.isFileAttached) {
                      return (
                        <Button
                          className={classNames(
                            'usa-button--unstyled attachment-viewer-button',
                            viewDocumentId === entry.docketEntryId && 'active',
                          )}
                          isActive={viewDocumentId === entry.docketEntryId}
                          key={entry.docketEntryId}
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
                            <div
                              className={classNames(
                                'grid-col-3',
                                entry.isStricken && 'stricken-docket-record',
                              )}
                            >
                              {entry.createdAtFormatted}
                              {entry.qcNeeded && (
                                <FontAwesomeIcon
                                  className="top-neg-2px fa-icon-red float-right position-relative"
                                  icon={['fa', 'star']}
                                  title="is untouched"
                                />
                              )}
                            </div>
                            <div className="grid-col-5">
                              <span
                                className={classNames(
                                  entry.isStricken && 'stricken-docket-record',
                                )}
                              >
                                {entry.descriptionDisplay}
                              </span>
                              {entry.isStricken && ' (STRICKEN)'}
                            </div>
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
                  },
                )}
              </div>
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
