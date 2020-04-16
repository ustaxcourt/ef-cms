const { Case } = require('../../entities/cases/Case');
const { generateHTMLTemplateForPDF } = require('./generateHTMLTemplateForPDF');

/**
 * HTML template generator for printable change of address/telephone PDF views
 *
 * @param {object} deconstructed function arguments
 * @param {object} deconstructed.applicationContext object that contains all the context specific methods
 * @param {object} deconstructed.content content to be injected into the template
 * @returns {string} hydrated HTML content in string form
 */
const generateChangeOfAddressTemplate = async ({
  applicationContext,
  content,
}) => {
  const {
    caption,
    docketNumberWithSuffix,
    documentTitle,
    name,
    newData,
    oldData,
  } = content;

  const templateData = {
    name,
    newData,
    oldData,
    showAddressAndPhoneChange:
      documentTitle === 'Notice of Change of Address and Telephone Number',
    showOnlyPhoneChange:
      documentTitle === 'Notice of Change of Telephone Number',
  };

  const changeOfAddressTemplateContent = require('./changeOfAddress.pug_');

  const pug = applicationContext.getPug();
  const compiledFunction = pug.compile(changeOfAddressTemplateContent);
  const main = compiledFunction({
    ...templateData,
  });

  const changeOfAddressSassContent = require('./changeOfAddress.scss_');
  const sass = applicationContext.getNodeSass();

  const { css } = await new Promise(resolve => {
    sass.render({ data: changeOfAddressSassContent }, (err, result) => {
      return resolve(result);
    });
  });

  const templateContent = {
    caseCaptionWithPostfix: `${caption} ${Case.CASE_CAPTION_POSTFIX}`,
    docketNumberWithSuffix,
    main,
  };

  const options = {
    h3: documentTitle,
    styles: css,
    title: 'Change of Contact Information',
  };

  return await generateHTMLTemplateForPDF({
    applicationContext,
    content: templateContent,
    options,
  });
};

module.exports = {
  generateChangeOfAddressTemplate,
};
