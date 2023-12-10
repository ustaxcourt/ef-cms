import { Order } from '@shared/business/utilities/pdfGenerator/documentTemplates/Order';
import { PageMetaHeaderDocket } from '@shared/business/utilities/pdfGenerator/components/PageMetaHeaderDocket';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const order = async ({
  applicationContext,
  data,
}: {
  applicationContext: IApplicationContext;
  data: {
    caseCaptionExtension: string;
    caseTitle: string;
    docketNumberWithSuffix: string;
    addedDocketNumbers: string[];
    nameOfClerk: string;
    orderContent: string;
    orderTitle: string;
    titleOfClerk: string;
  };
}) => {
  const {
    addedDocketNumbers,
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    nameOfClerk,
    orderContent,
    orderTitle,
    titleOfClerk,
  } = data;

  const reactOrderTemplate = ReactDOM.renderToString(
    React.createElement(Order, {
      nameOfClerk,
      options: {
        addedDocketNumbers,
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
      orderContent,
      orderTitle,
      titleOfClerk,
    }),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: reactOrderTemplate,
  });

  const headerHtml = ReactDOM.renderToString(
    React.createElement(PageMetaHeaderDocket, {
      docketNumber: docketNumberWithSuffix,
      useCenturySchoolbookFont: true,
    }),
  );

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      headerHtml,
    });

  return pdf;
};
