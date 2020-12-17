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
    shouldAbbreviateTitle = true,
    shouldWrapText = false,
    showModal,
    title,
  }) {
    const modalId = `PDFPreviewModal-${title}`;
    const fullTitle = file.name || file.documentType || title;
    const abbrevTitle = getStringAbbreviation(fullTitle, 50);
    const displayTitle = shouldAbbreviateTitle ? abbrevTitle : fullTitle;

    return (
      <>
        <Button
          link
          className="pdf-preview-btn padding-0"
          icon={['fas', 'file-pdf']}
          iconColor="blue"
          shouldWrapText={shouldWrapText}
          title={fullTitle}
          onClick={() => {
            return openPdfPreviewModalSequence({ file, modalId });
          }}
        >
          {displayTitle}
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
