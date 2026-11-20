import { DateServedFooter } from '@shared/business/utilities/pdfGenerator/components/DateServedFooter';
import {
  NoticeOfAssignmentOfJudge,
  NoticeOfAssignmentOfJudgeParams,
} from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfAssignmentOfJudge';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { generateHTMLTemplateForPDF } from '@shared/business/utilities/generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const noticeOfAssignmentOfJudge = async ({
  applicationContext,
  data,
}: {
  applicationContext: ServerApplicationContext;
  data: NoticeOfAssignmentOfJudgeParams;
}): Promise<Uint8Array> => {
  const { docketNumberWithSuffix } = data;

  const noticeOfAssignmentOfJudgeTemplate = ReactDOM.renderToString(
    React.createElement(NoticeOfAssignmentOfJudge, data),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: noticeOfAssignmentOfJudgeTemplate,
  });

  const footerHtml = ReactDOM.renderToString(
    React.createElement(DateServedFooter, {
      dateServed: applicationContext.getUtilities().formatNow('MMDDYY'),
    }),
  );

  return await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber: docketNumberWithSuffix,
      footerHtml,
    });
};
