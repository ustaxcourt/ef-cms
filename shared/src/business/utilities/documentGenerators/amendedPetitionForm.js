const {
  reactTemplateGenerator,
} = require('../generateHTMLTemplateForPDF/reactTemplateGenerator');
const { generateHTMLTemplateForPDF } = require('../generateHTMLTemplateForPDF');

const amendedPetitionForm = async ({ applicationContext }) => {
  const amendedPetitionFormTemplate = reactTemplateGenerator({
    componentName: 'AmendedPetitionForm',
  });

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: amendedPetitionFormTemplate,
    options: {
      overwriteMain: true,
      title: '',
    },
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
      overwriteHeader: true,
    });

  return pdf;
};

module.exports = {
  amendedPetitionForm,
};
