import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { PDFPreviewModal } from './PDFPreviewModal';

export const PDFPreviewButton = connect(
  {
    openPdfPreviewModalSequence: sequences.openPdfPreviewModalSequence,
    previewFile: state.previewPdfFile,
    showModal: state.showModal,
  },
  ({ file, openPdfPreviewModalSequence, previewFile, showModal }) => {
    return (
      <>
        <button
          className="usa-button usa-button--unstyled"
          type="button"
          onClick={() => openPdfPreviewModalSequence({ file })}
        >
          {file.name}
        </button>
        {showModal === 'PDFPreviewModal' && previewFile === file && (
          <PDFPreviewModal pdfFile={file} />
        )}
      </>
    );
  },
);
