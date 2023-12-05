import { GettingReadyForTrialChecklist } from '@shared/business/utilities/pdfGenerator/documentTemplates/GettingReadyForTrialChecklist';
import { PageMetaHeaderDocket } from '@shared/business/utilities/pdfGenerator/components/PageMetaHeaderDocket';
import { StandingPretrialOrder } from '@shared/business/utilities/pdfGenerator/documentTemplates/StandingPretrialOrder';
import { combineTwoPdfs } from './combineTwoPdfs';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const standingPretrialOrder = async ({ applicationContext, data }) => {
  const { caseCaptionExtension, caseTitle, docketNumberWithSuffix, trialInfo } =
    data;

  const reactStandingPretrialOrderTemplate = ReactDOM.renderToString(
    React.createElement(StandingPretrialOrder, {
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
    content: reactStandingPretrialOrderTemplate,
  });

  const headerHtml = ReactDOM.renderToString(
    React.createElement(PageMetaHeaderDocket, {
      docketNumber: docketNumberWithSuffix,
      useCenturySchoolbookFont: true,
    }),
  );

  const pretrialOrderPdf = await applicationContext
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

  const checklistContent = await generateHTMLTemplateForPDF({
    applicationContext,
    content: reactGettingReadyForTrialChecklistTemplate,
  });

  const checklistPdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: checklistContent,
      displayHeaderFooter: false,
      docketNumber: docketNumberWithSuffix,
    });

  return await combineTwoPdfs({
    applicationContext,
    firstPdf: new Uint8Array(pretrialOrderPdf),
    secondPdf: new Uint8Array(checklistPdf),
  });
};
