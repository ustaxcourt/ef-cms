import { Button } from '../ustc-ui/Button/Button';
import { ConfirmDeletePDFModal } from './ConfirmDeletePdfModal';
import {
  ConfirmRescanBatchModal,
  DeleteBatchModal,
  EmptyHopperModal,
  ScanErrorModal,
  UnfinishedScansModal,
} from './ScanBatchPreviewer/ScanBatchModals';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { PdfPreview } from '../ustc-ui/PdfPreview/PdfPreview';
import { PreviewControls } from './PreviewControls';
import { SelectScannerSourceModal } from './ScanBatchPreviewer/SelectScannerSourceModal';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { limitFileSize } from './limitFileSize';
import { sequences, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';

export const ScanBatchPreviewer = connect(
  {
    constants: state.constants,
    generatePdfFromScanSessionSequence:
      sequences.generatePdfFromScanSessionSequence,
    openChangeScannerSourceModalSequence:
      sequences.openChangeScannerSourceModalSequence,
    openConfirmDeleteBatchModalSequence:
      sequences.openConfirmDeleteBatchModalSequence,
    openConfirmDeletePDFModalSequence:
      sequences.openConfirmDeletePDFModalSequence,
    openConfirmRescanBatchModalSequence:
      sequences.openConfirmRescanBatchModalSequence,
    scanBatchPreviewerHelper: state.scanBatchPreviewerHelper,
    scanHelper: state.scanHelper,
    scannerStartupSequence: sequences.scannerStartupSequence,
    selectDocumentForScanSequence: sequences.selectDocumentForScanSequence,
    selectedBatchIndex: state.scanner.selectedBatchIndex,
    setCurrentPageIndexSequence: sequences.setCurrentPageIndexSequence,
    setDocumentForUploadSequence: sequences.setDocumentForUploadSequence,
    setDocumentUploadModeSequence: sequences.setDocumentUploadModeSequence,
    setSelectedBatchIndexSequence: sequences.setSelectedBatchIndexSequence,
    showModal: state.modal.showModal,
    startScanSequence: sequences.startScanSequence,
    validationErrors: state.validationErrors,
  },
  function ScanBatchPreviewer({
    constants,
    documentTabs,
    documentType,
    generatePdfFromScanSessionSequence,
    openChangeScannerSourceModalSequence,
    openConfirmDeleteBatchModalSequence,
    openConfirmDeletePDFModalSequence,
    openConfirmRescanBatchModalSequence,
    scanBatchPreviewerHelper,
    scanHelper,
    scannerStartupSequence,
    selectDocumentForScanSequence,
    selectedBatchIndex,
    setCurrentPageIndexSequence,
    setDocumentForUploadSequence,
    setDocumentUploadModeSequence,
    setSelectedBatchIndexSequence,
    showModal,
    startScanSequence,
    title,
    validateSequence,
    validationErrors,
  }) {
    useEffect(() => {
      scannerStartupSequence();
    }, []);

    const batchWrapperRef = useRef(null);

    useEffect(() => {
      if (batchWrapperRef.current)
        batchWrapperRef.current.scrollTop =
          batchWrapperRef.current.scrollHeight;
    }, [scanBatchPreviewerHelper.batches]);

    const renderPreviewSection = () => {
      return (
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
                      currentPageIndex: scanBatchPreviewerHelper.totalPages - 1,
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

          <div className="preview-container--image-area">
            <img
              src={`data:image/png;base64,${scanBatchPreviewerHelper.selectedPageImage}`}
            />
          </div>

          <Button
            aria-label="create pdf"
            className="margin-top-4"
            onClick={e => {
              e.preventDefault();
              generatePdfFromScanSessionSequence({
                documentType,
                documentUploadMode: 'preview',
              });
            }}
          >
            <FontAwesomeIcon icon={['fas', 'file-pdf']} />
            Create PDF
          </Button>
        </>
      );
    };

    const renderModeRadios = () => {
      const headerMargin =
        (documentTabs && documentTabs.length) > 0
          ? 'margin-top-2'
          : 'margin-top-0';
      return (
        <div className="grid-row">
          <div className="grid-col-8">
            <FormGroup
              errorText={[
                validationErrors[documentType],
                documentType === 'requestForPlaceOfTrialFile' &&
                  validationErrors.chooseAtLeastOneValue,
              ]}
            >
              <fieldset
                aria-label="scan mode selection"
                className={classNames(
                  'usa-fieldset margin-bottom-3',
                  headerMargin,
                )}
                id="scan-mode-radios"
              >
                <legend
                  className="usa-legend with-hint margin-bottom-2"
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
            </FormGroup>
          </div>

          <div className="grid-col-4 margin-top-4 text-align-right">
            {scanBatchPreviewerHelper.uploadMode === 'scan' &&
              scanBatchPreviewerHelper.scannerSource && (
                <Button
                  onClick={e => {
                    e.preventDefault();
                    startScanSequence();
                  }}
                >
                  <FontAwesomeIcon icon={['fas', 'plus-circle']} />
                  Start Scan
                </Button>
              )}
          </div>
        </div>
      );
    };

    const renderIframePreview = () => {
      return (
        <>
          {showModal === 'ConfirmDeletePDFModal' && (
            <ConfirmDeletePDFModal
              confirmSequence="removeScannedPdfSequence"
              confirmText="Yes, Delete"
              modalContent="This action cannot be undone."
              title="Are you sure you want to delete this PDF?"
            />
          )}
          <div className="padding-top-2">
            <Button
              link
              className="red-warning push-right margin-bottom-1 padding-top-0"
              onClick={() => {
                openConfirmDeletePDFModalSequence();
              }}
            >
              Remove PDF
            </Button>
            <PdfPreview />
          </div>
        </>
      );
    };

    const renderScan = () => {
      return (
        scanBatchPreviewerHelper.batches.length > 0 && (
          <>
            <h5 className="header-scanned-batches">Scanned batches</h5>
            <div className="batches-table-wrapper" ref={batchWrapperRef}>
              <table className="batches-table">
                <tbody>
                  {scanBatchPreviewerHelper.batches.map(batch => (
                    <tr className="no-blue-hover" key={batch.index}>
                      <td>
                        {selectedBatchIndex !== batch.index && (
                          <Button
                            link
                            aria-label={`batch ${batch.index + 1} -- ${
                              batch.pages.length
                            } pages total`}
                            onClick={e => {
                              e.preventDefault();
                              setSelectedBatchIndexSequence({
                                selectedBatchIndex: batch.index,
                              });
                            }}
                          >
                            Batch {batch.index + 1}
                          </Button>
                        )}
                        {selectedBatchIndex === batch.index && (
                          <span className="batch-index">
                            Batch {batch.index + 1}
                          </span>
                        )}
                      </td>

                      <td>
                        <span>{batch.scanModeLabel}</span>
                      </td>
                      <td>
                        <span>{batch.pages.length} pages</span>
                      </td>
                      <td>
                        <Button
                          link
                          aria-label={`rescan batch ${batch.index + 1}`}
                          className="no-underline"
                          onClick={e => {
                            e.preventDefault();
                            openConfirmRescanBatchModalSequence({
                              batchIndexToRescan: batch.index,
                            });
                          }}
                        >
                          <FontAwesomeIcon icon={['fas', 'redo-alt']} />
                          Rescan
                        </Button>
                      </td>
                      <td>
                        <Button
                          link
                          aria-label={`delete batch ${batch.index + 1} - with ${
                            batch.pages.length
                          } total pages`}
                          className="no-underline red-warning float-right"
                          onClick={e => {
                            e.preventDefault();
                            openConfirmDeleteBatchModalSequence({
                              batchIndexToDelete: batch.index,
                              batchPageCount: batch.pages.length,
                            });
                          }}
                        >
                          <FontAwesomeIcon icon={['fas', 'times-circle']} />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <hr className="lighter" />
          </>
        )
      );
    };

    const renderUpload = () => {
      return (
        <div className="document-detail-one-third">
          <FormGroup>
            <label
              className="usa-label ustc-upload-stin with-hint"
              htmlFor={`${documentType}-file`}
              id={`${documentType}-label`}
            >
              Upload your file{' '}
              <span className="success-message">
                <FontAwesomeIcon icon="check-circle" size="1x" />
              </span>
            </label>
            <span className="usa-hint">
              File must be in PDF format (.pdf). Max file size{' '}
              {constants.MAX_FILE_SIZE_MB}MB.
            </span>
            <input
              accept=".pdf"
              aria-describedby={`${documentType}-hint`}
              className="usa-input"
              id={`${documentType}-file`}
              name={documentType}
              type="file"
              onChange={e => {
                e.preventDefault();
                limitFileSize(e, constants.MAX_FILE_SIZE_MB, () => {
                  const file = e.target.files[0];
                  setDocumentForUploadSequence({
                    documentType,
                    documentUploadMode: 'preview',
                    file,
                  });
                  if (validateSequence) {
                    validateSequence();
                  }
                });
              }}
            />
          </FormGroup>
        </div>
      );
    };

    const renderTabs = documentTabsList => {
      if (documentTabsList && documentTabsList.length > 1) {
        return (
          <Tabs
            bind="currentViewMetadata.documentSelectedForScan"
            className="document-select container-tabs margin-top-neg-205 margin-x-neg-205"
            onSelect={() => {
              selectDocumentForScanSequence();
            }}
          >
            {documentTabsList.map(documentTab => (
              <Tab
                icon={['fas', 'check-circle']}
                iconColor="green"
                key={documentTab.documentType}
                showIcon={scanHelper[`${documentTab.documentType}Completed`]}
                tabName={documentTab.documentType}
                title={documentTab.title}
              />
            ))}
          </Tabs>
        );
      }

      return null;
    };

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

        {showModal === 'ScanErrorModal' && <ScanErrorModal />}

        {showModal === 'SelectScannerSourceModal' && (
          <SelectScannerSourceModal />
        )}

        <div className="scanner-area-header">
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-6">
                <h3 className="margin-bottom-0 margin-left-105">{title}</h3>
              </div>
              <div className="grid-col-6 text-right margin-top-2px padding-right-4">
                <span className="margin-right-1">
                  Scanner: {scanBatchPreviewerHelper.scannerSourceDisplayName}
                </span>
                <Button
                  link
                  aria-label={`${
                    scanBatchPreviewerHelper.scannerSource ? 'Change' : 'Select'
                  } scanner source`}
                  className="change-scanner-button padding-0"
                  onClick={e => {
                    e.preventDefault();
                    openChangeScannerSourceModalSequence();
                  }}
                >
                  {scanBatchPreviewerHelper.scannerSource
                    ? 'Change'
                    : 'Select Scanner'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="document-select-container">
          {renderTabs(documentTabs)}
          {scanBatchPreviewerHelper.uploadMode !== 'preview' &&
            renderModeRadios()}

          {scanBatchPreviewerHelper.uploadMode === 'scan' && renderScan()}

          {scanBatchPreviewerHelper.uploadMode === 'upload' && renderUpload()}

          {scanBatchPreviewerHelper.uploadMode === 'preview' &&
            renderIframePreview()}
        </div>

        {scanBatchPreviewerHelper.uploadMode === 'scan' &&
          scanBatchPreviewerHelper.selectedPageImage && (
            <div className="preview-container">{renderPreviewSection()}</div>
          )}
      </>
    );
  },
);
