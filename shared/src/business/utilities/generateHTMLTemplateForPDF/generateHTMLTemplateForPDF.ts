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
  const indexCss = require('../htmlGenerator/index.scss_');
  const template = require('../htmlGenerator/index.pug_');

  const pug = applicationContext.getPug();
  const sass = applicationContext.getNodeSass();

  let compileResult;
  try {
    compileResult = sass.compileString(indexCss);
  } catch (err) {
    applicationContext.logger.error(
      'Error compiling SASS to CSS while generating PDF',
      err,
    );
  }

  const { css } = compileResult;

  const compiledFunction = pug.compile(template);
  const html = compiledFunction({
    content,
    css,
    options,
  });

  return html;
};
