import { DateServedFooter } from '@shared/business/utilities/pdfGenerator/components/DateServedFooter';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  ThirtyDayNoticeOfTrial,
  ThirtyDayNoticeOfTrialRequiredInfo,
} from '../pdfGenerator/documentTemplates/ThirtyDayNoticeOfTrial';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const thirtyDayNoticeOfTrial = async ({
  applicationContext,
  data,
}: {
  applicationContext: ServerApplicationContext;
  data: ThirtyDayNoticeOfTrialRequiredInfo;
}): Promise<Uint8Array> => {
  const thirtyDayNoticeOfTrialTemplate = ReactDOM.renderToString(
    React.createElement(ThirtyDayNoticeOfTrial, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: thirtyDayNoticeOfTrialTemplate,
  });

  let footerHtml = '';
  if (data.dateServed) {
    footerHtml = ReactDOM.renderToString(
      React.createElement(DateServedFooter, {
        dateServed: data.dateServed,
      }),
    );
  }

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: data.docketNumberWithSuffix,
      footerHtml,
      headerHtml: '',
    });

  return pdf;
};
