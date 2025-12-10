import { ServerApplicationContext } from '@web-api/applicationContext';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { FORMATS } from '../DateHandler';
import { CertificateOfService } from '../pdfGenerator/documentTemplates/CertificateOfService';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';

export const certificateOfService = async ({
  applicationContext,
  data,
}: {
  applicationContext: ServerApplicationContext;
  data: {
    partyInformation: any;
    practitionerInformation: any;
    docketNumberWithSuffix: string;
  };
}): Promise<Uint8Array> => {
  const { partyInformation, practitionerInformation, docketNumberWithSuffix } =
    data;

  const date = applicationContext.getUtilities().formatNow(FORMATS.MMDDYY);

  const certificateOfServiceTemplate = ReactDOM.renderToString(
    React.createElement(CertificateOfService, {
      date,
      partyInformation,
      practitionerInformation,
    }),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: certificateOfServiceTemplate,
  });

  const footerHtml =
    '<div style="text-align: right; width: 100%; font-size: 16px;">T.C. Form 9 (08/12)</div>';

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      footerHtml,
      docketNumber: docketNumberWithSuffix,
    });

  return pdf;
};
