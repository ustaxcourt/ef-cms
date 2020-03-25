import { Button } from '../ustc-ui/Button/Button';
import { PDFPreviewErrorModal } from './PDFPreviewErrorModal';
import { PDFPreviewModal } from './PDFPreviewModal';
import { connect } from '@cerebral/react';
import { getStringAbbreviation } from '../utilities/getStringAbbreviation';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PDFPreviewButton = connect(
  {
    openPdfPreviewModalSequence: sequences.openPdfPreviewModalSequence,
    pdfPreviewModalHelper: state.pdfPreviewModalHelper,
    showModal: state.modal.showModal,
  },
  function PDFPreviewButton({
    file,
    openPdfPreviewModalSequence,
    pdfPreviewModalHelper,
    showModal,
    title,
  }) {
    const modalId = `PDFPreviewModal-${title}`;
    const fullTitle = file.name || file.documentType || title;
    const abbrevTitle = getStringAbbreviation(fullTitle, 50);
    return (
      <>
        <Button
          link
          className="pdf-preview-btn padding-0"
          icon={['fas', 'file-pdf']}
          iconColor="blue"
          title={fullTitle}
          onClick={() => {
            return openPdfPreviewModalSequence({ file, modalId });
          }}
        >
          {abbrevTitle}
        </Button>
        {showModal == modalId &&
          (pdfPreviewModalHelper.displayErrorText ? (
            <PDFPreviewErrorModal title={title} />
          ) : (
            <PDFPreviewModal preventScrolling={false} title={title} />
          ))}
      </>
    );
  },
);
