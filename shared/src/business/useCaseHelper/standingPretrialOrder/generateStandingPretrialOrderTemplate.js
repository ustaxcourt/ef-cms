const template = require('./standingPretrialOrder.pug_');
const {
  createISODateString,
  formatDateString,
  formatNow,
} = require('../../utilities/DateHandler');
const {
  generateHTMLTemplateForPDF,
} = require('../../utilities/generateHTMLTemplateForPDF');

/**
 * HTML template generator for a Standing Pretrial Order
 *
 * @param {object} deconstructed function arguments
 * @param {object} deconstructed.applicationContext object that contains all the context specific methods
 * @param {object} deconstructed.content content to be injected into the template
 * @returns {string} hydrated HTML content in string form
 */
const generateStandingPretrialOrderTemplate = async ({
  applicationContext,
  content,
}) => {
  const { caption, docketNumberWithSuffix, trialInfo } = content;

  const pug = applicationContext.getPug();

  const headerDate = formatNow('MMMM D, YYYY');
  const footerDate = formatNow('MMDDYYYY');
  const trialStartTimeIso = createISODateString(trialInfo.startTime, 'HH:mm');
  trialInfo.startTime = formatDateString(trialStartTimeIso, 'hh:mm A');
  trialInfo.fullStartDate = formatDateString(
    trialInfo.startDate,
    'dddd, MMMM D, YYYY',
  );
  trialInfo.startDate = formatDateString(trialInfo.startDate, 'MMDDYYYY');

  const compiledFunction = pug.compile(template);
  const main = compiledFunction({
    caption,
    docketNumberWithSuffix,
    footerDate,
    headerDate,
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
  generateStandingPretrialOrderTemplate,
};
