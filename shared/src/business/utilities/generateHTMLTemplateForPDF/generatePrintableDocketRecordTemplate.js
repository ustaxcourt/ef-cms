const React = require('react');
const ReactDOM = require('react-dom/server');
const { generateHTMLTemplateForPDF } = require('./generateHTMLTemplateForPDF');

require('regenerator-runtime');
require('@babel/register')({
  presets: ['@babel/preset-react', '@babel/preset-env'],
});
const DocketRecord = require('../pdfGenerator/documentTemplates/DocketRecord.jsx')
  .default;

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

  const reactDocketRecordTemplate = ReactDOM.renderToString(
    React.createElement(DocketRecord, {
      caseDetail,
      entries,
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
      },
    }),
  );

  const htmlTemplate = generateHTMLTemplateForPDF({
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
