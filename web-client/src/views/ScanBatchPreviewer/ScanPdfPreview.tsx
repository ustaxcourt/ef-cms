import { Button } from '@web-client/ustc-ui/Button/Button';
import { ConfirmDeletePDFModal } from '../ConfirmDeletePdfModal';
import { ConfirmReplacePetitionModal } from '../ConfirmReplacePetitionModal';
import { PdfPreview } from '@web-client/ustc-ui/PdfPreview/PdfPreview';
import React from 'react';

type ScanPdfPreviewProps = {
  confirmSequence: () => void;
  isPetitionFile?: boolean;
  onConfirmDelete: (() => void) | Function;
  onConfirmReplace?: (() => void) | Function;
  pdfPreviewUrl?: string;
  scanOnly?: boolean;
  showModal?: string;
  showRemovePdfButton?: boolean;
};

export const ScanPdfPreview = ({
  confirmSequence,
  isPetitionFile = false,
  onConfirmDelete,
  onConfirmReplace,
  pdfPreviewUrl,
  scanOnly = false,
  showModal,
  showRemovePdfButton = true,
}: ScanPdfPreviewProps) => {
  return (
    <>
      {pdfPreviewUrl && (
        <>
          {showRemovePdfButton && (
            <Button
              link
              className="red-warning push-right remove-pdf-button"
              data-testid="remove-pdf"
              onClick={() => {
                if (isPetitionFile && onConfirmReplace) {
                  onConfirmReplace();
                } else {
                  onConfirmDelete();
                }
              }}
            >
              Remove PDF
            </Button>
          )}
          <PdfPreview />
        </>
      )}
      {showModal === 'ConfirmDeletePDFModal' && (
        <ConfirmDeletePDFModal
          confirmSequence={confirmSequence}
          confirmText={scanOnly ? 'Yes, Remove' : 'Yes, Delete'}
          modalContent={
            scanOnly
              ? 'The current PDF will be permanently removed, and you will need to add a new PDF.'
              : 'This action cannot be undone.'
          }
          title={`Are you sure you want to ${scanOnly ? 'remove' : 'delete'} this PDF`}
        />
      )}

      {showModal === 'ConfirmReplacePetitionModal' && (
        <ConfirmReplacePetitionModal confirmSequence="removePetitionForReplacementSequence" />
      )}
    </>
  );
};

ScanPdfPreview.displayName = 'ScanPdfPreview';
