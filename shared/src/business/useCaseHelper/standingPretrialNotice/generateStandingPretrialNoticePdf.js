/**
 *
 * @param {object} caseInfo a raw object representing a petition
 * @returns {string} an html string resulting from rendering template with caseInfo
 */
exports.generateStandingPretrialNoticeHtml = async ({
  applicationContext,
  caseEntity,
}) => {
  const confirmSassContent = require('./../../assets/ustcPdf.scss_');
  const confirmTemplateContent = require('./standingPretrialNotice.pug_');
  const ustcLogoBufferBase64 = require('../../../../static/images/ustc_seal.png_');

  const pug = applicationContext.getPug();
  const sass = applicationContext.getNodeSass();

  const { css } = await new Promise(resolve => {
    sass.render({ data: confirmSassContent }, (err, result) => {
      return resolve(result);
    });
  });
  const compiledFunction = pug.compile(confirmTemplateContent);
  const html = compiledFunction({
    caseEntity,
    css,
    logo: ustcLogoBufferBase64,
  });
  return html;
};
