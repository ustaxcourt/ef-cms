import { PDFPreviewErrorModal } from './PDFPreviewErrorModal';
import { PDFPreviewModal } from './PDFPreviewModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PDFPreviewButton = connect(
  {
    openPdfPreviewModalSequence: sequences.openPdfPreviewModalSequence,
    pdfPreviewModalHelper: state.pdfPreviewModalHelper,
    previewFile: state.previewPdfFile,
    showModal: state.showModal,
  },
  ({
    file,
    openPdfPreviewModalSequence,
    pdfPreviewModalHelper,
    previewFile,
    showModal,
    title,
  }) => {
    return (
      <>
        <button
          className="usa-button usa-button--unstyled"
          type="button"
          onClick={() => openPdfPreviewModalSequence({ file })}
        >
          {file.name}
        </button>
        {showModal === 'PDFPreviewModal' &&
          previewFile === file &&
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
