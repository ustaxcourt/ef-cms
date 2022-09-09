const {
  DOCKET_ENTRY_VALIDATION_RULES,
} = require('./EntityValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
const { pick } = require('lodash');

/**
 * constructor
 *
 * @param {object} rawDocketEntry the raw docket entry data
 * @constructor
 */
function ReconciliationReportEntry() {
  Object.defineProperty(this, 'entityName', {
    enumerable: false,
    value: 'ReconciliationReportEntry',
  });
}

const REPORT_PROPERTIES = [
  'caseCaption',
  'docketEntryId',
  'docketNumber',
  'documentTitle',
  'eventCode',
  'isFileAttached',
  'filedBy',
  'filingDate',
  'index',
  'servedAt',
  'servedPartiesCode',
];

ReconciliationReportEntry.prototype.init = function init(rawDocketEntry) {
  REPORT_PROPERTIES.forEach(key => (this[key] = rawDocketEntry[key]));
};

joiValidationDecorator(ReconciliationReportEntry, {
  ...pick(DOCKET_ENTRY_VALIDATION_RULES, REPORT_PROPERTIES),
});

module.exports = {
  ReconciliationReportEntry: validEntityDecorator(ReconciliationReportEntry),
};
