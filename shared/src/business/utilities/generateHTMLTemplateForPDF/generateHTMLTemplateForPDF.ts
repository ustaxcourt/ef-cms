/**
 * HTML template generator for printable PDF views
 *
 * @param {object} deconstructed function arguments
 * @param {object} deconstructed.applicationContext object that contains all the context specific methods
 * @param {object} deconstructed.content content to be injected into the template
 * @param {object} deconstructed.options optional content that modifies the template
 * @returns {string} hydrated HTML content in string form
 */
export const generateHTMLTemplateForPDF = ({
  applicationContext,
  content,
  options = {},
}) => {
  const template = require('../htmlGenerator/index.pug_');

  const pug = applicationContext.getPug();
  const sass = applicationContext.getNodeSass();

  const { css } = sass.compile('../htmlGenerator/index.scss_');

  const compiledFunction = pug.compile(template);
  const html = compiledFunction({
    content,
    css,
    options,
  });

  return html;
};
