import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PreviewControls } from './PreviewControls';
import { SelectScannerSourceModal } from '../ustc-ui/Scan/SelectScannerSourceModal';
import { Text } from '../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { limitFileSize } from './limitFileSize';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

export const ScanBatchPreviewer = connect(
  {
    completeScanSequence: sequences.completeScanSequence,
    constants: state.constants,
    openChangeScannerSourceModalSequence:
      sequences.openChangeScannerSourceModalSequence,
    removeBatchSequence: sequences.removeBatchSequence,
    rescanBatchSequence: sequences.rescanBatchSequence,
    scanBatchPreviewerHelper: state.scanBatchPreviewerHelper,
    scannerStartupSequence: sequences.scannerStartupSequence,
    selectDocumentForPreviewSequence:
      sequences.selectDocumentForPreviewSequence,
    setCurrentPageIndexSequence: sequences.setCurrentPageIndexSequence,
    setDocumentUploadModeSequence: sequences.setDocumentUploadModeSequence,
    setSelectedBatchIndexSequence: sequences.setSelectedBatchIndexSequence,
    startScanSequence: sequences.startScanSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validatePetitionFromPaperSequence:
      sequences.validatePetitionFromPaperSequence,
    validationErrors: state.validationErrors,
  },
  ({
    completeScanSequence,
    constants,
    documentType,
    documentTypeName,
    openChangeScannerSourceModalSequence,
    removeBatchSequence,
    rescanBatchSequence,
    scanBatchPreviewerHelper,
    scannerStartupSequence,
    selectDocumentForPreviewSequence,
    setCurrentPageIndexSequence,
    setDocumentUploadModeSequence,
    setSelectedBatchIndexSequence,
    startScanSequence,
    updateFormValueSequence,
    validatePetitionFromPaperSequence,
    validationErrors,
  }) => {
    useEffect(() => {
      scannerStartupSequence();
    }, []);

    const renderModeRadios = () => {
      return (
        <fieldset
          aria-label="scan mode selection"
          className="usa-fieldset margin-bottom-3 margin-top-2"
          id="scan-mode-radios"
        >
          <legend className="usa-legend with-hint" id="scan-mode-radios-legend">
            File Upload
          </legend>
          <div className="usa-radio usa-radio__inline">
            <input
              aria-describedby="upload-mode"
              aria-labelledby="upload-mode-scan"
              checked={scanBatchPreviewerHelper.uploadMode === 'scan'}
              className="usa-radio__input"
              id="scanMode"
              name="uploadMode"
              type="radio"
              value="scan"
              onChange={() =>
                setDocumentUploadModeSequence({
                  documentUploadMode: 'scan',
                })
              }
            />
            <label
              className="usa-radio__label"
              htmlFor="scanMode"
              id="upload-mode-scan"
            >
              Scan
            </label>
          </div>

          <div className="usa-radio usa-radio__inline">
            <input
              aria-describedby="upload-mode"
              aria-labelledby="upload-mode-upload"
              checked={scanBatchPreviewerHelper.uploadMode === 'upload'}
              className="usa-radio__input"
              id="uploadMode"
              name="uploadMode"
              type="radio"
              value="upload"
              onChange={() =>
                setDocumentUploadModeSequence({
                  documentUploadMode: 'upload',
                })
              }
            />
            <label
              className="usa-radio__label"
              htmlFor="uploadMode"
              id="upload-mode-upload"
            >
              Upload
            </label>
          </div>
        </fieldset>
      );
    };

    const renderScan = () => {
      return (
        <>
          {scanBatchPreviewerHelper.showScannerSourceModal && (
            <SelectScannerSourceModal />
          )}
          <h5>Scanned Documents</h5>
          {scanBatchPreviewerHelper.batches.map(batch => (
            <div className="batch margin-bottom-2" key={batch.index}>
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
              <button
                className="usa-button usa-button--unstyled"
                onClick={e => {
                  e.preventDefault();
                  rescanBatchSequence({
                    batchIndex: batch.index,
                  });
                }}
              >
                <FontAwesomeIcon icon={['fas', 'redo-alt']} />
                Rescan
              </button>
              <button
                className="usa-button usa-button--unstyled"
                onClick={e => {
                  e.preventDefault();
                  removeBatchSequence({
                    batchIndex: batch.index,
                  });
                }}
              >
                <FontAwesomeIcon icon={['fas', 'times-circle']} />
                Remove
              </button>
            </div>
          ))}

          {scanBatchPreviewerHelper.scannerSource && (
            <button
              className="usa-button usa-button--unstyled margin-bottom-2"
              onClick={e => {
                e.preventDefault();
                startScanSequence();
              }}
            >
              <FontAwesomeIcon icon={['fas', 'plus-circle']} />
              Add Batch
            </button>
          )}

          {!scanBatchPreviewerHelper.scannerSource && (
            <button
              className="usa-button usa-button--unstyled margin-bottom-2"
              onClick={e => {
                e.preventDefault();
                openChangeScannerSourceModalSequence();
              }}
            >
              Select Scanner Source
            </button>
          )}

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
                          key: documentType,
                          value: file,
                        });
                        updateFormValueSequence({
                          key: `${documentType}Size`,
                          value: file.size,
                        });
                        validatePetitionFromPaperSequence();
                        selectDocumentForPreviewSequence({
                          documentType,
                          file,
                        });
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
        </>
      );
    };

    const renderUpload = () => {
      return (
        <div className="document-detail-one-third">
          <div
            className={`usa-form-group ${
              validationErrors[documentType] ? 'usa-form-group--error' : ''
            }`}
          >
            <input
              accept=".pdf"
              aria-describedby={`${documentType}-hint`}
              className="usa-input"
              id={`${documentType}-file`}
              name={documentType}
              type="file"
              onChange={e => {
                limitFileSize(e, constants.MAX_FILE_SIZE_MB, () => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.files[0],
                  });
                  updateFormValueSequence({
                    key: `${e.target.name}Size`,
                    value: e.target.files[0].size,
                  });
                  validatePetitionFromPaperSequence();
                });
              }}
            />
            <Text
              bind={`validationErrors.${documentType}`}
              className="usa-error-message"
            />
            <Text
              bind={`validationErrors.${documentType}Size`}
              className="usa-error-message"
            />
          </div>
        </div>
      );
    };

    return (
      <>
        <div
          style={{
            backgroundColor: '#162e51',
            color: 'white',
            padding: '10px',
          }}
        >
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-8">
                <h3 style={{ marginBottom: '0px' }}>Add {documentTypeName}</h3>
              </div>
              {scanBatchPreviewerHelper.uploadMode === 'scan' && (
                <div className="grid-col-4 text-right">
                  <span className="margin-right-1">
                    Scanner:{' '}
                    {scanBatchPreviewerHelper.scannerSource ||
                      'No Scanner Selected'}
                  </span>
                  <button
                    className="usa-button usa-button--unstyled"
                    style={{ color: 'white' }}
                    onClick={e => {
                      e.preventDefault();
                      openChangeScannerSourceModalSequence();
                    }}
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{ border: '1px solid #AAA', padding: '10px' }}>
          {renderModeRadios()}
          {scanBatchPreviewerHelper.uploadMode === 'scan' && renderScan()}
          {scanBatchPreviewerHelper.uploadMode === 'upload' && renderUpload()}
        </div>
      </>
    );
  },
);
