const template = require('./noticeOfTrialIssued.pug_');
const {
  createISODateString,
  formatDateString,
  formatNow,
} = require('../DateHandler');
const { Case } = require('../../entities/cases/Case');
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
  const { caseCaption, docketNumberWithSuffix, trialInfo } = content;

  const pug = applicationContext.getPug();

  const headerDate = formatNow('MMMM D, YYYY');
  const trialStartTimeIso = createISODateString(trialInfo.startTime, 'HH:mm');
  trialInfo.startTime = formatDateString(trialStartTimeIso, 'hh:mm A');
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
  generateNoticeOfTrialIssuedTemplate,
};
