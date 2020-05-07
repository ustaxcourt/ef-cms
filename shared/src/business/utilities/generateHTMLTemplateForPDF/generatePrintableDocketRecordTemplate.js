const { ContactFactory } = require('../../entities/contacts/ContactFactory');
const { generateHTMLTemplateForPDF } = require('./generateHTMLTemplateForPDF');
const { reactTemplateGenerator } = require('./reactTemplateGenerator');

/**
 * HTML template generator for printable docket record PDF views
 *
 * @param {object} deconstructed function arguments
 * @param {object} deconstructed.applicationContext object that contains all the context specific methods
 * @param {object} deconstructed.content content to be injected into the template
 * @returns {string} hydrated HTML content in string form
 */
const generatePrintableDocketRecordTemplate = async ({
  applicationContext,
  data,
}) => {
  const {
    caseCaptionExtension,
    caseDetail,
    caseTitle,
    docketNumberWithSuffix,
    entries,
  } = data;

  const reactDocketRecordTemplate = reactTemplateGenerator({
    componentName: 'DocketRecord',
    data: {
      caseDetail,
      countryTypes: ContactFactory.COUNTRY_TYPES,
      entries,
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
    },
  });

  const htmlTemplate = await generateHTMLTemplateForPDF({
    applicationContext,
    // TODO: Remove main prop when index.pug can be refactored to remove header logic
    content: { main: reactDocketRecordTemplate },
    options: {
      overwriteMain: true,
      title: `Docket Record for Case ${docketNumberWithSuffix}`,
    },
  });

  return htmlTemplate;
};

module.exports = { generatePrintableDocketRecordTemplate };
