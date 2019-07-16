import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { PDFPreviewModal } from './PDFPreviewModal';

export const PDFPreviewButton = connect(
  {
    openPdfPreviewModalSequence: sequences.openPdfPreviewModalSequence,
    showModal: state.showModal,
  },
  ({ file, openPdfPreviewModalSequence, showModal, title }) => {
    return (
      <>
        <button
          className="usa-button usa-button--unstyled"
          type="button"
          onClick={() => openPdfPreviewModalSequence({ file })}
        >
          {file.name}
        </button>
        {showModal === 'PDFPreviewModal' && (
          <PDFPreviewModal pdfFile={file} title={title} />
        )}
      </>
    );
  },
);
