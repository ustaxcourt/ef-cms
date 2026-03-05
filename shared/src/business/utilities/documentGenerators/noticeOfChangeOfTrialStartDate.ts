import { DateServedFooter } from '@shared/business/utilities/pdfGenerator/components/DateServedFooter';
import {
  NoticeOfChangeOfTrialStartDate,
  TrialSessionStartDateChangePDFInfo,
} from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfChangeOfTrialStartDate';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const noticeOfChangeOfTrialStartDate = async ({
  applicationContext,
  data,
}: {
  applicationContext: ServerApplicationContext;
  data: {
    caseCaptionExtension: string;
    caseTitle: string;
    docketNumberWithSuffix: string;
    updatedTrialSession: TrialSessionStartDateChangePDFInfo;
    previousTrialSession: TrialSessionStartDateChangePDFInfo;
  };
}): Promise<Uint8Array> => {
  const { docketNumberWithSuffix } = data;

  const noticeOfChangeOfTrialStartDateTemplate = ReactDOM.renderToString(
    React.createElement(NoticeOfChangeOfTrialStartDate, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: noticeOfChangeOfTrialStartDateTemplate,
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
