import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PreviewControls } from './PreviewControls';
import { connect } from '@cerebral/react';
import { limitFileSize } from './limitFileSize';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

export const ScanBatchPreviewer = connect(
  {
    completeScanSequence: sequences.completeScanSequence,
    constants: state.constants,
    scanBatchPreviewerHelper: state.scanBatchPreviewerHelper,
    scannerStartupSequence: sequences.scannerStartupSequence,
    setCurrentPageIndexSequence: sequences.setCurrentPageIndexSequence,
    setSelectedBatchIndexSequence: sequences.setSelectedBatchIndexSequence,
    startScanSequence: sequences.startScanSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validatePetitionFromPaperSequence:
      sequences.validatePetitionFromPaperSequence,
  },
  ({
    completeScanSequence,
    constants,
    scanBatchPreviewerHelper,
    scannerStartupSequence,
    setCurrentPageIndexSequence,
    setSelectedBatchIndexSequence,
    startScanSequence,
    updateFormValueSequence,
    validatePetitionFromPaperSequence,
  }) => {
    useEffect(() => {
      scannerStartupSequence();
    }, []);

    return (
      <div style={{ border: '1px solid #AAA', padding: '10px' }}>
        <h4>Scanned Documents</h4>
        {scanBatchPreviewerHelper.batches.map(batch => (
          <div className="batch" key={batch.index}>
            <button
              className="usa-button usa-button--unstyled"
              onClick={e => {
                e.preventDefault();
                setSelectedBatchIndexSequence({
                  selectedBatchIndex: batch.index,
                });
              }}
            >
              Batch {batch.index + 1}
            </button>
            <span>{batch.pages.length} pages</span>
            <button className="usa-button usa-button--unstyled">Rescan</button>
            <button className="usa-button usa-button--unstyled">Remove</button>
          </div>
        ))}
        <button
          className="usa-button usa-button--unstyled"
          onClick={e => {
            e.preventDefault();
            startScanSequence();
          }}
        >
          Add Batch
        </button>
        <br />

        {scanBatchPreviewerHelper.selectedPageImage && (
          <>
            <button
              className="usa-button"
              type="button"
              onClick={e => {
                e.preventDefault();
                completeScanSequence({
                  onComplete: file => {
                    limitFileSize(file, constants.MAX_FILE_SIZE_MB, () => {
                      updateFormValueSequence({
                        key: 'petitionFile',
                        value: file,
                      });
                      updateFormValueSequence({
                        key: 'petitionFileSize',
                        value: file.size,
                      });
                      validatePetitionFromPaperSequence();
                    });
                  },
                });
              }}
            >
              <FontAwesomeIcon icon={['fas', 'file-pdf']} />
              Create PDF
            </button>
            <hr />
            <div className="grid-container padding-x-0">
              <div className="grid-row grid-gap">
                <div className="grid-col-6">
                  <h4>
                    Scan Preview: Batch{' '}
                    {scanBatchPreviewerHelper.selectedBatch.index + 1}
                  </h4>
                </div>

                <div className="grid-col-6 text-right">
                  <PreviewControls
                    currentPage={scanBatchPreviewerHelper.currentPage + 1}
                    disableLeftButtons={
                      scanBatchPreviewerHelper.currentPage === 0
                    }
                    disableRightButtons={
                      scanBatchPreviewerHelper.currentPage ===
                      scanBatchPreviewerHelper.totalPages - 1
                    }
                    totalPages={scanBatchPreviewerHelper.totalPages}
                    onFirstPage={e => {
                      e.preventDefault();
                      setCurrentPageIndexSequence({
                        currentPageIndex: 0,
                      });
                    }}
                    onLastPage={e => {
                      e.preventDefault();
                      setCurrentPageIndexSequence({
                        currentPageIndex:
                          scanBatchPreviewerHelper.totalPages - 1,
                      });
                    }}
                    onNextPage={e => {
                      e.preventDefault();
                      setCurrentPageIndexSequence({
                        currentPageIndex:
                          scanBatchPreviewerHelper.currentPage + 1,
                      });
                    }}
                    onPreviousPage={e => {
                      e.preventDefault();
                      setCurrentPageIndexSequence({
                        currentPageIndex:
                          scanBatchPreviewerHelper.currentPage - 1,
                      });
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#999' }}>
              <img
                src={`data:image/png;base64,${scanBatchPreviewerHelper.selectedPageImage}`}
                style={{
                  display: 'block',
                  margin: '0 auto',
                  paddingBottom: '10px',
                  paddingTop: '10px',
                  width: '50%',
                }}
              />
            </div>
          </>
        )}
      </div>
    );
  },
);
