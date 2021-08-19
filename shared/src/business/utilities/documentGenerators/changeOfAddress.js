const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

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
        h3: documentTitle,
        showAddressAndPhoneChange:
          documentTitle === 'Notice of Change of Address and Telephone Number',
        showOnlyPhoneChange:
          documentTitle === 'Notice of Change of Telephone Number',
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
};
