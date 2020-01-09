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
  generatePrintableFilingReceiptTemplate,
} = require('./generatePrintableFilingReceiptTemplate');
const {
  generateTrialCalendarTemplate,
} = require('./generateTrialCalendarTemplate');
const {
  generateTrialSessionPlanningReportTemplate,
} = require('./generateTrialSessionPlanningReportTemplate');
const { generateHTMLTemplateForPDF } = require('./generateHTMLTemplateForPDF');

module.exports = {
  generateChangeOfAddressTemplate,
  generateHTMLTemplateForPDF,
  generateNoticeOfTrialIssuedTemplate,
  generatePrintableDocketRecordTemplate,
  generatePrintableFilingReceiptTemplate,
  generateTrialCalendarTemplate,
  generateTrialSessionPlanningReportTemplate,
};
