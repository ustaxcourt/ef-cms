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

const props = cerebralProps as unknown as {
  documentTabs: Record<string, any>[];
  documentType: string;
  scanOnly?: boolean;
  title: string;
  validateSequence?: () => void;
};

const petitionQcScanBatchPreviewerDeps = {
  deletePdfSequence: sequences.deleteUploadedPdfSequence,
  documentTabs: props.documentTabs,
  documentType: props.documentType,
  generatePdfFromScanSessionSequence:
    sequences.generatePdfFromScanSessionSequence,
  isPetitionFile: state.petitionQcHelper.isPetitionFile,
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
  selectedTabHasAttachment: state.petitionQcHelper.selectedTabHasAttachment,
  scanHelper: state.scanHelper,
  scannerStartupSequence: sequences.scannerStartupSequence,
  scanOnly: props.scanOnly ?? false,
  selectedBatchIndex: state.scanner.selectedBatchIndex,
  setCurrentPageIndexSequence: sequences.setCurrentPageIndexSequence,
  setDocumentForPreviewSequence: sequences.setDocumentForPreviewSequence,
  setDocumentUploadModeSequence: sequences.setDocumentUploadModeSequence,
  setSelectedBatchIndexSequence: sequences.setSelectedBatchIndexSequence,
  showModal: state.modal.showModal,
  showRemovePdfButton: state.petitionQcHelper.showRemovePdfButton,
  startScanSequence: sequences.startScanSequence,
  title: props.title,
  validateSequence: props.validateSequence,
  validationErrors: state.validationErrors,
};

export const PetitionQcScanBatchPreviewer = connect<
  typeof props,
  typeof petitionQcScanBatchPreviewerDeps
>(
  petitionQcScanBatchPreviewerDeps,
  function PetitionQcScanBatchPreviewer({
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
    selectedTabHasAttachment = false,
    scannerStartupSequence,
    scanOnly = false,
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
            bindTo="preview"
            documentTabs={documentTabs}
            isFileUploaded={eventCode =>
              !!scanHelper[`${eventCode}FileCompleted`]
            }
            onSelect={documentId => {
              setDocumentForPreviewSequence({ documentId });
            }}
            scanOnly={scanOnly}
            tabNameKey="documentId"
          />
          {(scanBatchPreviewerHelper.uploadMode !== 'preview' ||
            !pdfPreviewUrl ||
            !selectedTabHasAttachment) && (
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
            (scanBatchPreviewerHelper.uploadMode === 'upload' ||
              (scanBatchPreviewerHelper.uploadMode === 'preview' &&
                !selectedTabHasAttachment)) && (
              <ScanBatchFileInput
                documentType={documentType}
                validateSequence={validateSequence}
              />
            )}

          {scanBatchPreviewerHelper.uploadMode === 'preview' &&
            pdfPreviewUrl &&
            selectedTabHasAttachment && (
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

PetitionQcScanBatchPreviewer.displayName = 'PetitionQcScanBatchPreviewer';
