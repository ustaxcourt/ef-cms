const template = require('./standingPretrialOrder.pug_');
const {
  createISODateString,
  formatDateString,
  formatNow,
} = require('../../utilities/DateHandler');
const {
  generateHTMLTemplateForPDF,
} = require('../../utilities/generateHTMLTemplateForPDF');
const { Case } = require('../../entities/cases/Case');

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
  const { caseCaption, docketNumberWithSuffix, trialInfo } = content;

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

  let caseName = Case.getCaseCaptionNames(caseCaption);
  let caseCaptionExtension = '';
  if (caseName !== caseCaption) {
    caseName += ', ';
    caseCaptionExtension = caseCaption.replace(caseName, '');
  }

  const compiledFunction = pug.compile(template);
  const main = compiledFunction({
    caseCaptionExtension,
    caseName,
    docketNumberWithSuffix,
    footerDate,
    headerDate,
    trialInfo,
  });

  const templateContent = {
    caseCaptionWithPostfix: `${caseCaption} ${Case.CASE_CAPTION_POSTFIX}`,
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
