import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import { reactTemplateGenerator } from '../generateHTMLTemplateForPDF/reactTemplateGenerator';

export const computeChangeOptions = ({ documentType }) => {
  const options = {
    h3: documentType.title,
    isAddressAndPhoneChange: documentType.eventCode === 'NCAP',
    isAddressChange: ['NCA', 'NCAP'].includes(documentType.eventCode),
    isEmailChange: documentType.eventCode === 'NOCE',
    isPhoneChangeOnly: documentType.eventCode === 'NCP',
  };
  return options;
};

export const changeOfAddress = async ({ applicationContext, content }) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    name,
    newData,
    oldData,
  } = content;
  const options = computeChangeOptions(content);

  const changeOfAddressTemplate = reactTemplateGenerator({
    componentName: 'ChangeOfAddress',
    data: {
      name,
      newData,
      oldData,
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        ...options,
      },
    },
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: changeOfAddressTemplate,
  });

  const { docketNumber } = content;

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber,
    });

  return pdf;
};
