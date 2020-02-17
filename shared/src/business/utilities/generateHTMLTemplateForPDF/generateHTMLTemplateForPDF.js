/**
 * HTML template generator for printable PDF views
 *
 * @param {object} deconstructed function arguments
 * @param {object} deconstructed.applicationContext object that contains all the context specific methods
 * @param {object} deconstructed.content content to be injected into the template
 * @param {object} deconstructed.options optional content that modifies the template
 * @returns {string} hydrated HTML content in string form
 */
const generateHTMLTemplateForPDF = async ({
  applicationContext,
  content,
  options = {},
}) => {
  const sassContent = require('../htmlGenerator/index.scss_');
  const template = require('../htmlGenerator/index.pug_');

  const pug = applicationContext.getPug();
  const sass = applicationContext.getNodeSass();

  const { css } = await new Promise(resolve => {
    sass.render({ data: sassContent }, (err, result) => {
      return resolve(result);
    });
  });
  const compiledFunction = pug.compile(template);
  const html = compiledFunction({
    content,
    css,
    options,
  });

  return html;
};

module.exports = {
  generateHTMLTemplateForPDF,
};
