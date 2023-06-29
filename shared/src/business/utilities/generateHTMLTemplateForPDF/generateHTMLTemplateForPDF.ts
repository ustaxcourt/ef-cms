/**
 * HTML template generator for printable PDF views
 *
 * @param {object} deconstructed function arguments
 * @param {object} deconstructed.applicationContext object that contains all the context specific methods
 * @param {object} deconstructed.content content to be injected into the template
 * @param {object} deconstructed.options optional content that modifies the template
 * @returns {string} hydrated HTML content in string form
 */
export const generateHTMLTemplateForPDF = async ({
  applicationContext,
  content,
  options = {},
}) => {
  const sassContent = require('../htmlGenerator/index.scss_');
  const template = require('../htmlGenerator/index.pug_');

  const pug = applicationContext.getPug();
  const sass = applicationContext.getNodeSass();

  const { css } = await new Promise((resolve, reject) => {
    sass.render({ data: sassContent }, (err, result) => {
      if (err) {
        applicationContext.logger.error(
          'Error compiling SASS to CSS while generating PDF',
          err,
        );
        return reject(err);
      }
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
