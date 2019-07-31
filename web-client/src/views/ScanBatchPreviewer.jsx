import {
  ConfirmRescanBatchModal,
  DeleteBatchModal,
  EmptyHopperModal,
  UnfinishedScansModal,
} from './ScanBatchPreviewer/ScanBatchModals';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PdfPreview } from '../ustc-ui/PdfPreview/PdfPreview';
import { PreviewControls } from './PreviewControls';
import { SelectScannerSourceModal } from './ScanBatchPreviewer/SelectScannerSourceModal';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { Text } from '../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { limitFileSize } from './limitFileSize';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

export const ScanBatchPreviewer = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
    completeScanSequence: sequences.completeScanSequence,
    constants: state.constants,
    openChangeScannerSourceModalSequence:
      sequences.openChangeScannerSourceModalSequence,
    openConfirmDeleteBatchModalSequence:
      sequences.openConfirmDeleteBatchModalSequence,
    openConfirmRescanBatchModalSequence:
      sequences.openConfirmRescanBatchModalSequence,
    scanBatchPreviewerHelper: state.scanBatchPreviewerHelper,
    scannerStartupSequence: sequences.scannerStartupSequence,
    selectDocumentForPreviewSequence:
      sequences.selectDocumentForPreviewSequence,
    selectDocumentForScanSequence: sequences.selectDocumentForScanSequence,
    selectedBatchIndex: state.selectedBatchIndex,
    setCurrentPageIndexSequence: sequences.setCurrentPageIndexSequence,
    setDocumentUploadModeSequence: sequences.setDocumentUploadModeSequence,
    setModalDialogNameSequence: sequences.setModalDialogNameSequence,
    setSelectedBatchIndexSequence: sequences.setSelectedBatchIndexSequence,
    showModal: state.showModal,
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
    openChangeScannerSourceModalSequence,
    openConfirmDeleteBatchModalSequence,
    openConfirmRescanBatchModalSequence,
    scanBatchPreviewerHelper,
    scannerStartupSequence,
    selectDocumentForPreviewSequence,
    selectDocumentForScanSequence,
    selectedBatchIndex,
    setCurrentPageIndexSequence,
    setDocumentUploadModeSequence,
    setSelectedBatchIndexSequence,
    showModal,
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
        <div
          className={`usa-form-group ${
            validationErrors[documentType] ? 'usa-form-group--error' : ''
          }`}
        >
          <fieldset
            aria-label="scan mode selection"
            className="usa-fieldset margin-bottom-3 margin-top-2"
            id="scan-mode-radios"
          >
            <legend
              className="usa-legend with-hint"
              id="scan-mode-radios-legend"
            >
              How do you want to add this document?
            </legend>
            <div className="usa-radio usa-radio__inline">
              <input
                aria-describedby="scan-mode-radios-legend"
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
                aria-describedby="scan-mode-radios-legend"
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
          <Text
            bind={`validationErrors.${documentType}`}
            className="usa-error-message"
          />
        </div>
      );
    };

    const renderIframePreview = () => {
      return (
        <>
          <PdfPreview />
          <button
            className="usa-button usa-button--outline red-warning"
            onClick={e => {
              e.preventDefault();
              updateFormValueSequence({
                key: documentType,
                value: null,
              });
              updateFormValueSequence({
                key: `${documentType}Size`,
                value: null,
              });
              setDocumentUploadModeSequence({
                documentUploadMode: 'scan',
              });
            }}
          >
            <FontAwesomeIcon icon={['fas', 'times-circle']} />
            Delete PDF
          </button>
        </>
      );
    };

    const renderScan = () => {
      return (
        <>
          {showModal === 'ConfirmRescanBatchModal' && (
            <ConfirmRescanBatchModal batchIndex={selectedBatchIndex} />
          )}
          {showModal === 'ConfirmDeleteBatchModal' && (
            <DeleteBatchModal batchIndex={selectedBatchIndex} />
          )}

          {showModal === 'UnfinishedScansModal' && <UnfinishedScansModal />}

          {showModal === 'EmptyHopperModal' && <EmptyHopperModal />}

          {scanBatchPreviewerHelper.showScannerSourceModal && (
            <SelectScannerSourceModal />
          )}
          <h5>Scanned Documents</h5>
          {scanBatchPreviewerHelper.batches.length > 0 && (
            <table>
              <tbody>
                {scanBatchPreviewerHelper.batches.map(batch => (
                  <tr key={batch.index}>
                    <td>
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
                    </td>
                    <td>
                      <span>{batch.pages.length} pages</span>
                    </td>
                    <td>
                      <button
                        className="usa-button usa-button--unstyled no-underline"
                        onClick={e => {
                          e.preventDefault();
                          openConfirmRescanBatchModalSequence({
                            batchIndexToRescan: batch.index,
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={['fas', 'redo-alt']} />
                        Rescan
                      </button>
                    </td>
                    <td>
                      <button
                        className="usa-button usa-button--unstyled no-underline red-warning float-right"
                        onClick={e => {
                          e.preventDefault();
                          openConfirmDeleteBatchModalSequence({
                            batchIndexToDelete: batch.index,
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={['fas', 'times-circle']} />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {scanBatchPreviewerHelper.scannerSource && (
            <button
              className="usa-button usa-button--unstyled margin-bottom-2 no-underline"
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
              <div className="grid-container padding-x-0">
                <div className="grid-row grid-gap">
                  <div className="grid-col-6">
                    <h4 className="margin-bottom-0 margin-top-2">
                      Scan Preview: Batch{' '}
                      {scanBatchPreviewerHelper.selectedBatch.index + 1}
                    </h4>
                  </div>

                  <div className="grid-col-6 text-right margin-bottom-2">
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

              <button
                className="usa-button margin-top-4"
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
                        setDocumentUploadModeSequence({
                          documentUploadMode: 'preview',
                        });
                      });
                    },
                  });
                }}
              >
                <FontAwesomeIcon icon={['fas', 'file-pdf']} />
                Create PDF
              </button>
            </>
          )}
        </>
      );
    };

    const renderUpload = () => {
      return (
        <div className="document-detail-one-third">
          <div className="usa-form-group">
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
                  selectDocumentForPreviewSequence({
                    documentType,
                    file: e.target.files[0],
                  });
                  setDocumentUploadModeSequence({
                    documentUploadMode: 'preview',
                  });
                });
              }}
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
                <h3 className="margin-bottom-0">Add Document(s)</h3>
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
        <div style={{ border: '1px solid #AAA', padding: '20px' }}>
          <Tabs
            bind="documentSelectedForScan"
            className="document-select container-tabs margin-top-neg-205 margin-x-neg-205"
            onSelect={() => {
              selectDocumentForScanSequence();
            }}
          >
            <Tab tabName="petitionFile" title="Petition" />
            <Tab tabName="stinFile" title="STIN" />
            <Tab
              tabName="requestForPlaceOfTrialFile"
              title="Request for Place of Trial"
            />
            <Tab tabName="ownershipDisclosureFile" title="ODS" />
          </Tabs>
          {scanBatchPreviewerHelper.uploadMode !== 'preview' &&
            renderModeRadios()}
          {scanBatchPreviewerHelper.uploadMode === 'preview' &&
            renderIframePreview()}
          {scanBatchPreviewerHelper.uploadMode === 'scan' && renderScan()}
          {scanBatchPreviewerHelper.uploadMode === 'upload' && renderUpload()}
        </div>
      </>
    );
  },
);
