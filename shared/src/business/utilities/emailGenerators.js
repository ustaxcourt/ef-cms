const {
  reactTemplateGenerator,
} = require('./generateHTMLTemplateForPDF/reactTemplateGenerator');

const documentService = async ({ data }) => {
  const {
    caseCaption,
    docketNumber,
    documentName,
    loginUrl,
    name,
    serviceDate,
    serviceTime,
  } = data;

  const documentServiceHtml = reactTemplateGenerator({
    componentName: 'DocumentService',
    data: {
      caseCaption,
      docketNumber,
      documentName,
      loginUrl,
      name,
      serviceDate,
      serviceTime,
    },
  });

  return documentServiceHtml;
};

module.exports = {
  documentService,
};
