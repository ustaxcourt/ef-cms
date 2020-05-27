const {
  generateChangeOfAddressTemplate,
} = require('./generateChangeOfAddressTemplate');
const {
  generateNoticeOfTrialIssuedTemplate,
} = require('./generateNoticeOfTrialIssuedTemplate');
const {
  generatePrintableDocketRecordTemplate,
} = require('./generatePrintableDocketRecordTemplate');
const {
  generateTrialSessionPlanningReportTemplate,
} = require('./generateTrialSessionPlanningReportTemplate');
const { generateHTMLTemplateForPDF } = require('./generateHTMLTemplateForPDF');

module.exports = {
  generateChangeOfAddressTemplate,
  generateHTMLTemplateForPDF,
  generateNoticeOfTrialIssuedTemplate,
  generatePrintableDocketRecordTemplate,
  generateTrialSessionPlanningReportTemplate,
};
