import { Button } from '../ustc-ui/Button/Button';
import { Mobile } from '../ustc-ui/Responsive/Responsive';
import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect } from 'react';

import { PdfPreview } from '../ustc-ui/PdfPreview/PdfPreview';

export const PDFPreviewModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.dismissModalSequence,
    currentPage: state.modal.pdfPreviewModal.currentPage,
    loadPdfSequence: sequences.loadPdfSequence,
    pdfPreviewModal: state.modal.pdfPreviewModal,
    pdfPreviewModalHelper: state.pdfPreviewModalHelper,
    previewPdfFile: state.previewPdfFile,
    totalPages: state.modal.pdfPreviewModal.totalPages,
  },
  function PDFPreviewModal({
    cancelSequence,
    confirmSequence,
    loadPdfSequence,
    preventScrolling,
    previewPdfFile,
    title,
  }) {
    useEffect(() => {
      loadPdfSequence({
        file: previewPdfFile,
      });
    }, []);

    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className="pdf-preview-modal"
        confirmLabel="Ok"
        confirmSequence={confirmSequence}
        preventScrolling={preventScrolling}
        showButtons={false}
        title={title}
      >
        <Mobile>
          <div className="modal-mobile-header">
            <Button
              link
              className="back heading-3"
              icon={['fas', 'caret-left']}
              iconColor="white"
              iconSize="lg"
              onClick={() => cancelSequence()}
            >
              Back to Review Your Filing
            </Button>
          </div>
          <h2 aria-hidden="true" className="modal-mobile-title">
            {title}
          </h2>
        </Mobile>
        <div>
          <div className="pdf-preview-content">
            <PdfPreview />
          </div>
        </div>
      </ModalDialog>
    );
  },
);

PDFPreviewModal.displayName = 'PDFPreviewModal';
