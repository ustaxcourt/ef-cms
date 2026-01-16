import {
  ConfirmRescanBatchModal,
  DeleteBatchModal,
  EmptyHopperModal,
  ScanErrorModal,
  UnfinishedScansModal,
} from './ScanBatchPreviewer/ScanBatchModals';
import { ScanBatchFileInput } from './ScanBatchPreviewer/ScanBatchFileInput';
import { ScanBatchesTable } from './ScanBatchPreviewer/ScanBatchesTable';
import { ScanDocumentTabs } from './ScanBatchPreviewer/ScanDocumentTabs';
import { ScanModeRadios } from './ScanBatchPreviewer/ScanModeRadios';
import { ScanPdfPreview } from './ScanBatchPreviewer/ScanPdfPreview';
import { ScanPreviewSection } from './ScanBatchPreviewer/ScanPreviewSection';
import { ScannerAreaHeader } from './ScanBatchPreviewer/ScannerAreaHeader';
import { SelectScannerSourceModal } from './ScanBatchPreviewer/SelectScannerSourceModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props as cerebralProps } from 'cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';

export type ScanBatchPreviewerProps = {
  documentTabs?: Record<string, any>[];
  documentType: string | null;
  title: string;
  validateSequence?: Function;
  deletePdfSequence?: string;
  showRemovePdfButton?: boolean;
  isPetitionFile?: boolean;
};

const props = cerebralProps as unknown as ScanBatchPreviewerProps;

type ScanSelectModalProps = {
  showModal: string;
};

const ScanSelectModal: React.FC<ScanSelectModalProps> = ({ showModal }) => {
  switch (showModal) {
    case 'ConfirmRescanBatchModal':
      return <ConfirmRescanBatchModal />;
    case 'ConfirmDeleteBatchModal':
      return <DeleteBatchModal />;
    case 'UnfinishedScansModal':
      return <UnfinishedScansModal />;
    case 'EmptyHopperModal':
      return <EmptyHopperModal />;
    case 'ScanErrorModal':
      return <ScanErrorModal />;
    case 'SelectScannerSourceModal':
      return <SelectScannerSourceModal />;
    default:
      return null;
  }
};

const scanBatchPreviewerDeps = {
  constants: state.constants,
  documentTabs: props.documentTabs,
  documentType: props.documentType,
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
  removeScannedPdfSequence: sequences.removeScannedPdfSequence,
  scanBatchPreviewerHelper: state.scanBatchPreviewerHelper,
  scanHelper: state.scanHelper,
  scannerStartupSequence: sequences.scannerStartupSequence,
  selectDocumentForScanSequence: sequences.selectDocumentForScanSequence,
  selectedBatchIndex: state.scanner.selectedBatchIndex,
  setCurrentPageIndexSequence: sequences.setCurrentPageIndexSequence,
  setDocumentForUploadSequence: sequences.setDocumentForUploadSequence,
  setDocumentUploadModeSequence: sequences.setDocumentUploadModeSequence,
  setIsLoadingSequence: sequences.setIsLoadingSequence,
  setIsNotLoadingSequence: sequences.setIsNotLoadingSequence,
  setSelectedBatchIndexSequence: sequences.setSelectedBatchIndexSequence,
  showFileUploadErrorModalSequence: sequences.showFileUploadErrorModalSequence,
  showModal: state.modal.showModal,
  startScanSequence: sequences.startScanSequence,
  title: props.title,
  validateSequence: props.validateSequence,
  validationErrors: state.validationErrors,
};

export const ScanBatchPreviewer = connect<
  ScanBatchPreviewerProps,
  typeof scanBatchPreviewerDeps
>(
  scanBatchPreviewerDeps,
  function ScanBatchPreviewer({
    documentTabs,
    documentType,
    generatePdfFromScanSessionSequence,
    openChangeScannerSourceModalSequence,
    openConfirmDeleteBatchModalSequence,
    openConfirmDeletePDFModalSequence,
    openConfirmRescanBatchModalSequence,
    removeScannedPdfSequence,
    scanBatchPreviewerHelper,
    scanHelper,
    scannerStartupSequence,
    selectDocumentForScanSequence,
    selectedBatchIndex,
    setCurrentPageIndexSequence,
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

    const batchWrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (batchWrapperRef.current)
        batchWrapperRef.current.scrollTop =
          batchWrapperRef.current.scrollHeight;
    }, [scanBatchPreviewerHelper.batches]);

    if (!documentType) {
      return null;
    }

    return (
      <>
        <ScanSelectModal showModal={showModal} />

        <ScannerAreaHeader
          onOpenChangeScannerSource={openChangeScannerSourceModalSequence}
          scannerSource={scanBatchPreviewerHelper.scannerSource}
          scannerSourceDisplayName={
            scanBatchPreviewerHelper.scannerSourceDisplayName
          }
          title={title}
        />

        <div className="document-select-container">
          <ScanDocumentTabs
            documentTabs={documentTabs}
            isFileUploaded={eventCode =>
              !!scanHelper[`${eventCode}FileCompleted`]
            }
            onSelect={() => {
              selectDocumentForScanSequence();
            }}
          />
          {scanBatchPreviewerHelper.uploadMode !== 'preview' && (
            <ScanModeRadios
              errorText={[
                validationErrors[documentType],
                documentType === 'requestForPlaceOfTrialFile' &&
                  validationErrors['object.missing'],
              ]}
              hasDocumentTabs={!!(documentTabs && documentTabs.length > 0)}
              onSetScanMode={() =>
                setDocumentUploadModeSequence({
                  documentUploadMode: 'scan',
                })
              }
              onSetUploadMode={() =>
                setDocumentUploadModeSequence({
                  documentUploadMode: 'upload',
                })
              }
              onStartScan={e => {
                e.preventDefault();
                startScanSequence();
              }}
              scannerSource={scanBatchPreviewerHelper.scannerSource}
              uploadMode={scanBatchPreviewerHelper.uploadMode}
            />
          )}

          {scanBatchPreviewerHelper.uploadMode === 'scan' && (
            <ScanBatchesTable
              batches={scanBatchPreviewerHelper.batches}
              batchWrapperRef={batchWrapperRef as React.RefObject<HTMLDivElement>}
              onDeleteBatch={(batchIndex, pageCount) => {
                openConfirmDeleteBatchModalSequence({
                  batchIndexToDelete: batchIndex,
                  batchPageCount: pageCount,
                });
              }}
              onRescanBatch={batchIndex => {
                openConfirmRescanBatchModalSequence({
                  batchIndexToRescan: batchIndex,
                });
              }}
              onSelectBatch={batchIndex => {
                setSelectedBatchIndexSequence({
                  selectedBatchIndex: batchIndex,
                });
              }}
              selectedBatchIndex={selectedBatchIndex}
            />
          )}

          {scanBatchPreviewerHelper.uploadMode === 'upload' && (
            <ScanBatchFileInput
              documentType={documentType}
              validateSequence={validateSequence}
            />
          )}

          {scanBatchPreviewerHelper.uploadMode === 'preview' && (
            <ScanPdfPreview
              confirmSequence={() => {
                removeScannedPdfSequence();
                if (validateSequence) validateSequence();
              }}
              onConfirmDelete={openConfirmDeletePDFModalSequence}
              pdfPreviewUrl={scanBatchPreviewerHelper.pdfPreviewUrl}
              showModal={showModal}
            />
          )}
        </div>

        {scanBatchPreviewerHelper.uploadMode === 'scan' &&
          scanBatchPreviewerHelper.selectedPageImage && (
            <div className="preview-container">
              <ScanPreviewSection
                batchIndex={scanBatchPreviewerHelper.selectedBatch.index}
                currentPage={scanBatchPreviewerHelper.currentPage}
                onCreatePdf={e => {
                  e.preventDefault();
                  generatePdfFromScanSessionSequence({
                    documentType,
                    documentUploadMode: 'preview',
                  });
                }}
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
                selectedPageImage={scanBatchPreviewerHelper.selectedPageImage}
                totalPages={scanBatchPreviewerHelper.totalPages}
              />
            </div>
          )}
      </>
    );
  },
);

ScanBatchPreviewer.displayName = 'ScanBatchPreviewer';
