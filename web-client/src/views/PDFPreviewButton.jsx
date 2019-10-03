import { Button } from '../ustc-ui/Button/Button';
import { PDFPreviewErrorModal } from './PDFPreviewErrorModal';
import { PDFPreviewModal } from './PDFPreviewModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PDFPreviewButton = connect(
  {
    openPdfPreviewModalSequence: sequences.openPdfPreviewModalSequence,
    pdfPreviewModalHelper: state.pdfPreviewModalHelper,
    previewPdfFile: state.previewPdfFile,
    showModal: state.showModal,
  },
  ({
    file,
    openPdfPreviewModalSequence,
    pdfPreviewModalHelper,
    previewPdfFile,
    showModal,
    title,
  }) => {
    return (
      <>
        <Button
          link
          className="pdf-preview-btn padding-0"
          onClick={() => openPdfPreviewModalSequence({ file })}
        >
          {file.name}
        </Button>
        {showModal === 'PDFPreviewModal' &&
          previewPdfFile === file &&
          (pdfPreviewModalHelper.displayErrorText ? (
            <PDFPreviewErrorModal title={title} />
          ) : (
            <PDFPreviewModal
              pdfFile={file}
              preventScrolling={false}
              title={title}
            />
          ))}
      </>
    );
  },
);
