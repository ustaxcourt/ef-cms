import { DateServedFooter } from '@shared/business/utilities/pdfGenerator/components/DateServedFooter';
import { NoticeOfChangeOfTrialLocation } from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfChangeOfTrialLocation';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const noticeOfChangeOfTrialLocation = async ({
  applicationContext,
  data,
}: {
  applicationContext: ServerApplicationContext;
  data: {
    docketNumberWithSuffix: string;
    trialSession: RawTrialSession;
  };
}): Promise<Uint8Array> => {
  const { docketNumberWithSuffix } = data;

  const noticeOfChangeOfTrialLocationTemplate = ReactDOM.renderToString(
    React.createElement(NoticeOfChangeOfTrialLocation, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: noticeOfChangeOfTrialLocationTemplate,
  });

  const footerHtml = ReactDOM.renderToString(
    React.createElement(DateServedFooter, {
      dateServed: applicationContext.getUtilities().formatNow('MMDDYY'),
    }),
  );

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      footerHtml,
    });

  return pdf;
};
