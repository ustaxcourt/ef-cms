import { Button } from '../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile, NonMobile } from '../ustc-ui/Responsive/Responsive';
import { PDFPreviewErrorModal } from './PDFPreviewErrorModal';
import { PDFPreviewModal } from './PDFPreviewModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { getStringAbbreviation } from '../utilities/getStringAbbreviation';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PDFPreviewButton = connect(
  {
    openPdfPreviewModalSequence: sequences.openPdfPreviewModalSequence,
    pdfPreviewModalHelper: state.pdfPreviewModalHelper,
    showModal: state.modal.showModal,
  },
  function PDFPreviewButton({
    file,
    id,
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
        <Mobile>
          <FontAwesomeIcon
            className="fa-icon-blue"
            icon={['fas', 'file-pdf']}
          />
          {displayTitle}
        </Mobile>
        <NonMobile>
          <Button
            link
            className="pdf-preview-btn padding-0"
            icon={['fas', 'file-pdf']}
            iconColor="blue"
            id={id}
            shouldWrapText={shouldWrapText}
            title={fullTitle}
            onClick={() => {
              return openPdfPreviewModalSequence({ file, modalId });
            }}
          >
            {displayTitle}
          </Button>
        </NonMobile>
        {showModal == modalId &&
          (pdfPreviewModalHelper.displayErrorText ? (
            <PDFPreviewErrorModal title={title} />
          ) : (
            <PDFPreviewModal preventScrolling={true} title={title} />
          ))}
      </>
    );
  },
);

PDFPreviewButton.displayName = 'PDFPreviewButton';
