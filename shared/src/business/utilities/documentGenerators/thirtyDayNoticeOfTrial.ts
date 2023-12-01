import { DateServedFooter } from '@shared/business/utilities/pdfGenerator/components/DateServedFooter';
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
  applicationContext: IApplicationContext;
  data: ThirtyDayNoticeOfTrialRequiredInfo;
}): Promise<Buffer> => {
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
