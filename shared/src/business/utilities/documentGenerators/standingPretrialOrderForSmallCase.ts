import { GettingReadyForTrialChecklist } from '@shared/business/utilities/pdfGenerator/documentTemplates/GettingReadyForTrialChecklist';
import { PageMetaHeaderDocket } from '@shared/business/utilities/pdfGenerator/components/PageMetaHeaderDocket';
import { StandingPretrialOrderForSmallCase } from '@shared/business/utilities/pdfGenerator/documentTemplates/StandingPretrialOrderForSmallCase';
import { combineTwoPdfs } from './combineTwoPdfs';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const standingPretrialOrderForSmallCase = async ({
  applicationContext,
  data,
}) => {
  const { caseCaptionExtension, caseTitle, docketNumberWithSuffix, trialInfo } =
    data;

  const reactStandingPretrialOrderForSmallCaseTemplate =
    ReactDOM.renderToString(
      React.createElement(StandingPretrialOrderForSmallCase, {
        options: {
          caseCaptionExtension,
          caseTitle,
          docketNumberWithSuffix,
        },
        trialInfo,
      }),
    );

  const pdfContentHtmlWithHeader = await generateHTMLTemplateForPDF({
    applicationContext,
    content: reactStandingPretrialOrderForSmallCaseTemplate,
  });

  const headerHtml = ReactDOM.renderToString(
    React.createElement(PageMetaHeaderDocket, {
      docketNumber: docketNumberWithSuffix,
      useCenturySchoolbookFont: true,
    }),
  );

  const pdfWithHeader = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtmlWithHeader,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      headerHtml,
    });

  const reactGettingReadyForTrialChecklistTemplate = ReactDOM.renderToString(
    React.createElement(GettingReadyForTrialChecklist, {
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
      trialInfo,
    }),
  );

  const pdfContentHtmlWithoutHeader = await generateHTMLTemplateForPDF({
    applicationContext,
    content: reactGettingReadyForTrialChecklistTemplate,
  });

  const pdfWithoutHeader = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtmlWithoutHeader,
      displayHeaderFooter: false,
      docketNumber: docketNumberWithSuffix,
    });

  return await combineTwoPdfs({
    applicationContext,
    firstPdf: new Uint8Array(pdfWithHeader),
    secondPdf: new Uint8Array(pdfWithoutHeader),
  });
};
