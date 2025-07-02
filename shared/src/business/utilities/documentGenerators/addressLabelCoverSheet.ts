import {
  AddressLabelCoverSheet,
  AddressLabelCoverSheetParams,
} from '@shared/business/utilities/pdfGenerator/documentTemplates/AddressLabelCoverSheet';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const addressLabelCoverSheet = async ({
  applicationContext,
  data,
}: {
  applicationContext: ServerApplicationContext;
  data: AddressLabelCoverSheetParams;
}) => {
  const addressLabelCoverSheetTemplate = ReactDOM.renderToString(
    React.createElement(AddressLabelCoverSheet, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: addressLabelCoverSheetTemplate,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
    });

  return pdf;
};
