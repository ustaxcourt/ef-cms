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
        <button
          className="usa-button usa-button--unstyled pdf-preview-btn"
          type="button"
          onClick={() => openPdfPreviewModalSequence({ file })}
        >
          {file.name}
        </button>
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
