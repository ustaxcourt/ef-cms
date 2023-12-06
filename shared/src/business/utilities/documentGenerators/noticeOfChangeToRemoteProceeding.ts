import { DateServedFooter } from '@shared/business/utilities/pdfGenerator/components/DateServedFooter';
import { NoticeOfChangeToRemoteProceeding } from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfChangeToRemoteProceeding';
import { TrialInfoType } from '@shared/business/useCases/trialSessions/generateNoticeOfChangeToRemoteProceedingInteractor';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const noticeOfChangeToRemoteProceeding = async ({
  applicationContext,
  data,
}: {
  applicationContext: IApplicationContext;
  data: {
    nameOfClerk: string;
    titleOfClerk: string;
    caseCaptionExtension: string;
    caseTitle: string;
    docketNumberWithSuffix: string;
    trialInfo: TrialInfoType;
  };
}): Promise<Buffer> => {
  const { docketNumberWithSuffix } = data;

  const noticeOfChangeToRemoteProceedingTemplate = ReactDOM.renderToString(
    React.createElement(NoticeOfChangeToRemoteProceeding, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: noticeOfChangeToRemoteProceedingTemplate,
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
