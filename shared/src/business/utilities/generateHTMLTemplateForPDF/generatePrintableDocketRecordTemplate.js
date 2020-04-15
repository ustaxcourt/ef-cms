const { Case } = require('../../entities/cases/Case');
const { generateHTMLTemplateForPDF } = require('./generateHTMLTemplateForPDF');

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
  content,
}) => {
  const { caption, docketNumberWithSuffix, docketRecord, partyInfo } = content;

  const styles = `
    .party-info {
      border: 1px solid #ccc;
      margin: 15px 0 30px 0;
    }

    .party-info-header {
      padding: 10px;
      border-bottom: 1px solid #ccc;
      background: #f0f0f0;
      font-size: 10px;
      font-weight: bold;
    }

    .party-info-content {
      display: flex;
      flex-flow: row wrap;
      align-items: flex-start;
      padding: 0 10px 10px 10px;
    }

    .party-details {
      width: 25%;
    }

    .docket-record-table {
      margin-top: 30px;
    }
  `;

  const templateContent = {
    caseCaptionWithPostfix: `${caption} ${Case.CASE_CAPTION_POSTFIX}`,
    docketNumberWithSuffix,
    main: `
    ${partyInfo}
    <div class="docket-record">${docketRecord}</div>
  `,
  };
  const options = {
    h2: 'Docket Record',
    styles,
    title: 'Docket Record',
  };

  return await generateHTMLTemplateForPDF({
    applicationContext,
    content: templateContent,
    options,
  });
};

module.exports = { generatePrintableDocketRecordTemplate };
