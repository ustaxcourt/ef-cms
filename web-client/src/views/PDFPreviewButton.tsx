import { Button } from '../ustc-ui/Button/Button';
import { Mobile, NonMobile } from '../ustc-ui/Responsive/Responsive';
import { connect } from '@web-client/presenter/shared.cerebral';
import { getStringAbbreviation } from '../utilities/getStringAbbreviation';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

const pdfPreviewButtonDeps = {
  loadPdfForTabSequence: sequences.loadPdfForTabSequence,
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
    loadPdfForTabSequence,
    shouldAbbreviateTitle = false,
    shouldWrapText = true,
    showIcon = true,
    title,
    ...props
  }) {
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
              return loadPdfForTabSequence({ file });
            }}
          >
            {displayTitle}
          </Button>
        </NonMobile>
      </>
    );
  },
);

PDFPreviewButton.displayName = 'PDFPreviewButton';
