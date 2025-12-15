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
  documentTabs: Record<string, any>[];
  documentType: string;
  title: string;
  validateSequence?: () => void;
  scanOnly?: boolean;
  deletePdfSequence?: string;
  showRemovePdfButton?: boolean;
  isPetitionFile?: boolean;
};

const props = cerebralProps as unknown as ScanBatchPreviewerProps;

const scanBatchPreviewerDeps = {
  deletePdfSequence: props.deletePdfSequence
    ? sequences[props.deletePdfSequence]
    : sequences.removeScannedPdfSequence,
  documentTabs: props.documentTabs,
  documentType: props.documentType,
  generatePdfFromScanSessionSequence:
    sequences.generatePdfFromScanSessionSequence,
  isPetitionFile: props.isPetitionFile,
  openChangeScannerSourceModalSequence:
    sequences.openChangeScannerSourceModalSequence,
  openConfirmDeleteBatchModalSequence:
    sequences.openConfirmDeleteBatchModalSequence,
  openConfirmDeletePDFModalSequence:
    sequences.openConfirmDeletePDFModalSequence,
  openConfirmReplacePetitionPdfSequence:
    sequences.openConfirmReplacePetitionPdfSequence,
  openConfirmRescanBatchModalSequence:
    sequences.openConfirmRescanBatchModalSequence,
  pdfPreviewUrl: state.pdfPreviewUrl,
  scanBatchPreviewerHelper: state.scanBatchPreviewerHelper,
  scanHelper: state.scanHelper,
  scannerStartupSequence: sequences.scannerStartupSequence,
  scanOnly: props.scanOnly,
  selectDocumentForScanSequence: sequences.selectDocumentForScanSequence,
  selectedBatchIndex: state.scanner.selectedBatchIndex,
  setCurrentPageIndexSequence: sequences.setCurrentPageIndexSequence,
  setDocumentForPreviewSequence: sequences.setDocumentForPreviewSequence,
  setDocumentUploadModeSequence: sequences.setDocumentUploadModeSequence,
  setSelectedBatchIndexSequence: sequences.setSelectedBatchIndexSequence,
  showModal: state.modal.showModal,
  showRemovePdfButton: props.showRemovePdfButton,
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
    deletePdfSequence,
    documentTabs,
    documentType,
    generatePdfFromScanSessionSequence,
    isPetitionFile = false,
    openChangeScannerSourceModalSequence,
    openConfirmDeleteBatchModalSequence,
    openConfirmDeletePDFModalSequence,
    openConfirmReplacePetitionPdfSequence,
    openConfirmRescanBatchModalSequence,
    pdfPreviewUrl,
    scanBatchPreviewerHelper,
    scanHelper,
    scannerStartupSequence,
    scanOnly = false,
    selectDocumentForScanSequence,
    selectedBatchIndex,
    setCurrentPageIndexSequence,
    setDocumentForPreviewSequence,
    setDocumentUploadModeSequence,
    setSelectedBatchIndexSequence,
    showModal,
    showRemovePdfButton = true,
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
    return (
      <>
        {showModal === 'ConfirmRescanBatchModal' && (
          <ConfirmRescanBatchModal />
        )}
        {showModal === 'ConfirmDeleteBatchModal' && (
          <DeleteBatchModal />
        )}

        {showModal === 'UnfinishedScansModal' && <UnfinishedScansModal />}

        {showModal === 'EmptyHopperModal' && <EmptyHopperModal />}

        {showModal === 'ScanErrorModal' && <ScanErrorModal />}

        {showModal === 'SelectScannerSourceModal' && (
          <SelectScannerSourceModal />
        )}

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
            onSelect={
              scanOnly
                ? documentId => {
                    setDocumentForPreviewSequence({ documentId });
                  }
                : () => {
                    selectDocumentForScanSequence();
                  }
            }
            scanOnly={scanOnly}
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
              scanOnly={scanOnly}
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

          {!scanOnly &&
            scanBatchPreviewerHelper.uploadMode === 'upload' && (
              <ScanBatchFileInput
                documentType={documentType}
                validateSequence={validateSequence}
              />
            )}

          {scanBatchPreviewerHelper.uploadMode === 'preview' && (
            <ScanPdfPreview
              confirmSequence={() => {
                deletePdfSequence();
                if (validateSequence) validateSequence();
              }}
              isPetitionFile={isPetitionFile}
              onConfirmDelete={openConfirmDeletePDFModalSequence}
              onConfirmReplace={openConfirmReplacePetitionPdfSequence}
              pdfPreviewUrl={pdfPreviewUrl}
              scanOnly={scanOnly}
              showModal={showModal}
              showRemovePdfButton={showRemovePdfButton}
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
