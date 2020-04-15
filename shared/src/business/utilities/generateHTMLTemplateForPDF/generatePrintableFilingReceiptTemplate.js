const { Case } = require('../../entities/cases/Case');
const { generateHTMLTemplateForPDF } = require('./generateHTMLTemplateForPDF');

/**
 * HTML template generator for printable filing receipt PDF views
 *
 * @param {object} deconstructed function arguments
 * @param {object} deconstructed.applicationContext object that contains all the context specific methods
 * @param {object} deconstructed.content content to be injected into the template
 * @returns {string} hydrated HTML content in string form
 */
const generatePrintableFilingReceiptTemplate = async ({
  applicationContext,
  content,
}) => {
  const {
    caption,
    docketNumberWithSuffix,
    documentsFiledContent,
    filedAt,
    filedBy,
  } = content;

  const templateContent = {
    caseCaptionWithPostfix: `${caption} ${Case.CASE_CAPTION_POSTFIX}`,
    docketNumberWithSuffix,
    main: `
    <div class="filing-info">
      <div class="filed-by">Filed by ${filedBy}</div>
      <div class="filed-at">Filed ${filedAt}</div>
    </div>
    <div class="clear"></div>
    <div class="grid-container-main">
      <div class="panel">
        <div class="header">
          Documents Filed
        </div>
        <div class="content grid-container">${documentsFiledContent}</div>
      </div>
    </div>
  `,
  };

  const options = {
    h3: 'Receipt of Filing',
    styles: `
      .filing-info {
        margin: 10px 0;
      }

      .filed-by {
        width: 50%;
        float: left;
      }

      .filed-at {
        width: 50%;
        float: right;
        text-align: right;
      }

      h4.document-includes-header {
        margin-bottom: 5px;
        padding-bottom: 0;
      }

      .included {
        margin: 5px 0px;
      }

      hr {
        margin: 12px 0px 8px 0px;
      }
    `,
    title: 'Receipt of Filing',
  };

  return await generateHTMLTemplateForPDF({
    applicationContext,
    content: templateContent,
    options,
  });
};

module.exports = { generatePrintableFilingReceiptTemplate };
