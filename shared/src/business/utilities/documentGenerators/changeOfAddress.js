const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const computeChangeOptions = content => {
  const { documentType } = content;

  const options = {
    isAddressAndPhoneChange: documentType.eventCode === 'NCAP',
    isAddressChange: ['NCA', 'NCAP'].includes(documentType.eventCode),
    isEmailChange: documentType.eventCode === 'NOCE',
    isPhoneChangeOnly: documentType.eventCode === 'NCP',
  };
  return options;
};

const changeOfAddress = async ({ applicationContext, content }) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    documentTitle,
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
    options: {
      overwriteMain: true,
      title: documentTitle,
    },
  });

  const { docketNumber } = content;

  const headerHtml = reactTemplateGenerator({
    componentName: 'PageMetaHeaderDocket',
    data: {
      docketNumber,
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber,
      headerHtml,
      overwriteHeader: true,
    });

  return pdf;
};

module.exports = {
  changeOfAddress,
  computeChangeOptions,
};
