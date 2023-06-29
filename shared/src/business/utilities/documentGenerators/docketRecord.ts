import { COUNTRY_TYPES } from '../../entities/EntityConstants';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { reactTemplateGenerator } from '../generateHTMLTemplateForPDF/reactTemplateGenerator';

export const docketRecord = async ({ applicationContext, data }) => {
  const {
    caseCaptionExtension,
    caseDetail,
    caseTitle,
    docketNumberWithSuffix,
    entries,
    includePartyDetail,
  } = data;

  const docketRecordTemplate = reactTemplateGenerator({
    componentName: 'DocketRecord',
    data: {
      caseDetail,
      countryTypes: COUNTRY_TYPES,
      entries,
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        includePartyDetail,
      },
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: docketRecordTemplate,
  });

  const footerHtml = reactTemplateGenerator({
    componentName: 'DatePrintedFooter',
    data: {
      datePrinted: applicationContext.getUtilities().formatNow('MMDDYY'),
    },
  });

  const docketNumber = data.caseDetail.docketNumberWithSuffix;

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber,
      footerHtml,
    });

  return pdf;
};
