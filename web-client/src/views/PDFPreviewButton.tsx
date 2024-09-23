import { Button } from '../ustc-ui/Button/Button';
import { Mobile, NonMobile } from '../ustc-ui/Responsive/Responsive';
import { PDFPreviewErrorModal } from './PDFPreviewErrorModal';
import { PDFPreviewModal } from './PDFPreviewModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { getStringAbbreviation } from '../utilities/getStringAbbreviation';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const pdfPreviewButtonDeps = {
  openPdfPreviewModalSequence: sequences.openPdfPreviewModalSequence,
  pdfPreviewModalHelper: state.pdfPreviewModalHelper,
  showModal: state.modal.showModal,
};

export const PDFPreviewButton = connect<
  {
    file: any;
    title: string;
    id?: string;
    shouldAbbreviateTitle?: boolean;
    shouldWrapText?: boolean;
    showIcon?: boolean;
    showModal?: boolean;
  },
  typeof pdfPreviewButtonDeps
>(
  pdfPreviewButtonDeps,
  function PDFPreviewButton({
    file,
    id,
    openPdfPreviewModalSequence,
    pdfPreviewModalHelper,
    shouldAbbreviateTitle = false,
    shouldWrapText = true,
    showIcon = true,
    showModal,
    title,
    ...props
  }) {
    const modalId = `PDFPreviewModal-${title}`;
    const fullTitle = file.name || file.documentType || title;
    const abbrevTitle = getStringAbbreviation(fullTitle, 50);
    const displayTitle = shouldAbbreviateTitle ? abbrevTitle : fullTitle;
    const buttonProps = {
      children: displayTitle,
      className: 'pdf-preview-btn padding-0',
      'data-testid': props['data-testid'],
      icon: showIcon && ['fas', 'file-pdf'],
      iconColor: showIcon && 'blue',
      id,
      link: true,
      shouldWrapText,
      title: fullTitle,
    };

    return (
      <>
        <Mobile>
          <Button
            {...buttonProps}
            onClick={() => {
              const url = window.URL.createObjectURL(file);
              window.open(url, '_blank');
            }}
          >
            {displayTitle}
          </Button>
        </Mobile>
        <NonMobile>
          <Button
            {...buttonProps}
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
