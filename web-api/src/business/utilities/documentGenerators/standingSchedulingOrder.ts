import { PageMetaHeaderDocket } from '@shared/business/utilities/pdfGenerator/components/PageMetaHeaderDocket';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  StandingSchedulingOrder,
  StandingSchedulingOrderTrialInfo,
} from '@shared/business/utilities/pdfGenerator/documentTemplates/StandingSchedulingOrder';
import { generateHTMLTemplateForPDF } from '@shared/business/utilities/generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const standingSchedulingOrder = async ({
  applicationContext,
  data,
}: {
  applicationContext: ServerApplicationContext;
  data: {
    caseCaptionExtension: string;
    caseTitle: string;
    docketNumberWithSuffix: string;
    trialInfo: StandingSchedulingOrderTrialInfo;
  };
}): Promise<Uint8Array> => {
  const { caseCaptionExtension, caseTitle, docketNumberWithSuffix, trialInfo } =
    data;

  const standingSchedulingOrderTemplate = ReactDOM.renderToString(
    React.createElement(StandingSchedulingOrder, {
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
      trialInfo,
    }),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: standingSchedulingOrderTemplate,
  });

  const headerHtml = ReactDOM.renderToString(
    React.createElement(PageMetaHeaderDocket, {
      docketNumber: docketNumberWithSuffix,
      useCenturySchoolbookFont: true,
    }),
  );

  return await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      headerHtml,
    });
};
