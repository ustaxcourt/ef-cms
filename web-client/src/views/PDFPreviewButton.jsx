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
    showModal: state.showModal,
  },
  ({
    file,
    openPdfPreviewModalSequence,
    pdfPreviewModalHelper,
    showModal,
    title,
  }) => {
    console.log('title is', title);
    return (
      <>
        <Button
          link
          className="pdf-preview-btn padding-0"
          icon={['fas', 'file-pdf']}
          iconColor="blue"
          onClick={() => {
            return openPdfPreviewModalSequence({ file });
          }}
        >
          {file.name || file.documentType || title}
        </Button>
        {showModal === 'PDFPreviewModal' &&
          (pdfPreviewModalHelper.displayErrorText ? (
            <PDFPreviewErrorModal title={title} />
          ) : (
            <PDFPreviewModal preventScrolling={false} title={title} />
          ))}
      </>
    );
  },
);
