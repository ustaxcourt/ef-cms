const template = require('./noticeOfTrialIssued.pug_');
const { generateHTMLTemplateForPDF } = require('./generateHTMLTemplateForPDF');

/**
 * HTML template generator for a Notice of Trial Issued
 *
 * @param {object} deconstructed function arguments
 * @param {object} deconstructed.applicationContext object that contains all the context specific methods
 * @param {object} deconstructed.content content to be injected into the template
 * @returns {string} hydrated HTML content in string form
 */
const generateNoticeOfTrialIssuedTemplate = async ({
  applicationContext,
  content,
}) => {
  const { caption, docketNumberWithSuffix, trialInfo } = content;

  const pug = applicationContext.getPug();

  const compiledFunction = pug.compile(template);
  const main = compiledFunction({
    caption,
    docketNumberWithSuffix,
    trialInfo,
  });

  const templateContent = {
    caption,
    docketNumberWithSuffix,
    main,
  };

  return await generateHTMLTemplateForPDF({
    applicationContext,
    content: templateContent,
    options: { overwriteMain: true },
  });
};

module.exports = {
  generateNoticeOfTrialIssuedTemplate,
};
