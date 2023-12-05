import { NoticeOfDocketChange } from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfDocketChange';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const noticeOfDocketChange = async ({
  applicationContext,
  data,
}: {
  applicationContext: IApplicationContext;
  data: {
    nameOfClerk: string;
    titleOfClerk: string;
    docketEntryIndex: string;
    filingParties: { after: string | undefined; before: string | undefined };
    filingsAndProceedings: { after: string; before: string };
    caseCaptionExtension: string;
    caseTitle: string;
    docketNumberWithSuffix: string;
  };
}) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketEntryIndex,
    docketNumberWithSuffix,
    filingParties,
    filingsAndProceedings,
    nameOfClerk,
    titleOfClerk,
  } = data;

  const NoticeOfDocketChangeTemplate = ReactDOM.renderToString(
    React.createElement(NoticeOfDocketChange, {
      docketEntryIndex,
      filingParties,
      filingsAndProceedings,
      nameOfClerk,
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
      titleOfClerk,
    }),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: NoticeOfDocketChangeTemplate,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
      docketNumber: docketNumberWithSuffix,
    });

  return pdf;
};
